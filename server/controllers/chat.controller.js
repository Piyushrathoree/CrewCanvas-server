import Chat from "../models/chat.model.js";
import Teamspace from "../models/teamspace.model.js";

// const defaultSender = req.user._id;
const getChatByTeamspace = async (req, res) => {
    const { teamspaceId } = req.params;

    if (!teamspaceId) {
        return res.statusd(404).json({ message: "Team Space doesnt exist" });
    }

    const teamspace = await Teamspace.findOne({ _id: teamspaceId });
    // findById should used without curly braces

    if (!teamspace) {
        return res.status(401).json({ message: "Chat room not started yet" });
    }

    const isMember = teamspace.members.some(
        (member) => member.user.toString() === req.user.id
    );

    if (!isMember) {
        return res
            .status(402)
            .json({ message: "User not a part of the Team Space" });
    }

    const chat = await Chat.findOne({ teamspaceId });

    if (!chat) {
        return res.status(401).json({ message: "Chat does not exist" });
    }
    res.status(200).json({ chat });

    // res.status(200).json({ messages: teamspace.chat });
    //also relevant
}; // checked 

const addMessageToChat = async (req, res) => {
    const { content } = req.body;
    const { teamspaceId } = req.params;
    const senderId = req.user.id;
    if (!content || !teamspaceId) {
        return res.status(404).json({
            message: "something is missing either in params or in body ",
        });
    }

    const teamspace = await Teamspace.findById(teamspaceId);
    if (!teamspace) {
        return res.status(404).json({ error: "Teamspace not found" });
    }
    const isMember = teamspace.members.some(
        (member) => member.user.toString() === senderId
    );
    if (!isMember) {
        return res
            .status(403)
            .json({ error: "User not a member of this Teamspace" });
    }
    // find existing chat
    let chat = await Chat.findOne({ teamspaceId: teamspaceId });

    if (!chat) {
        chat = new Chat({ teamspaceId, messages: [] });
    }

    const newMessage = {
        sender: senderId,
        content,
        timestamps: new Date(),
    };
    chat.messages.push(newMessage);
    await chat.save();
    res.status(201).json(newMessage);
}; //checked 

const deleteMessage = async (req, res) => {
    const { teamspaceId, messageId } = req.params;
    const senderId = req.user.id;
    const teamspace = await Teamspace.findById(teamspaceId);
    if (!teamspace) {
        return res.status(404).json({ message: "teamspace not found" });
    }
    const isMember = teamspace.members.find(
        (member) => member.user.toString() === senderId
    );
    if (!isMember || isMember.role !== "admin") {
        return res
            .status(401)
            .json({ message: "current user is not a member of teamspace" });
    }
    const chat = await Chat.findOne({ teamspaceId });
    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }
    const messageIndex = chat.messages.findIndex(
        (message) => message._id.toString() === messageId
    );
    if (messageIndex === -1) {
        return res.status(404).json({ message: "Message not found" });
    }
    chat.messages.splice(messageIndex, 1);
    await chat.save();
    
    return res.status(200).json({ message: "Message deleted successfully" });
}; // checked 

// delete the whole chat -- only done by owner
// const deleteWholeChat = async (req, res) => {
//     const { teamspaceId } = req.params;
//     if (!teamspace) {
//         return res.status(404).json({ message: "teamspace not found" });
//     }

//     const teamspace = await Teamspace.findById(teamspaceId);
//     if (teamspace.OwnerId.toString() !== req.user.id) {
//         return res
//             .status(403)
//             .json({ error: "Only the owner can delete the chat" });
//     }
//     // delete the whole chat if user is owner
//     const result = await Chat.findByIdAndDelete({ teamspaceId });
//     if (!result) {
//         return res.status(404).json({ error: "Chat not found" });
//     }

//     res.status(200).json({ message: "Chat deleted successfully" });
// };

export { getChatByTeamspace, addMessageToChat, deleteMessage };

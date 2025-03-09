import Chat from "../models/chat.model.js";
import Teamspace from "../models/teamSpace.model.js";

// const defaultSender = req.user._id;
export const getChatByTeamspace = async (req, res) => {
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
        (member) => member.user.toString() === req.user._id
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
};
export const addMessageToChat = async (req, res) => {
    const { content } = req.body;
    const { teamspaceId } = req.params;
    const senderId = req.user._id;
    if (!message || !teamspaceId) {
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
    let chat = await findOne({ _id: teamspaceId });
    if (!chat) {
        chat = new Chat({ teamspaceId, message: [] });
    }

    newMessage = {
        sender: senderId,
        content,
        timestamps: new Date(),
    };
    chat.message.push(newMessage);
    await chat.save();
    res.status(201).json(newMessage);
};
export const deleteMessage = async (req, res) => {
    const {teamspaceId, messageId} = req.params;
    const senderId = req.user._id
    const teamspace = await Teamspace.findById(teamspaceId);
    if(!teamspace){
        return res.status(404).json(mesage:"teamspace not found")
    }
    const isMember = teamspace.members.some(member => member.user.toString() === senderId);
    if(!isMember || isMember.role !== 'admin'){
        return res.status(401).json({message:"current user is not a memeber of teamspace"})
    }
    const result = await User.updateOne({teamspaceId} ,{
        $pull:{messages:{_id:messageId}}
    })
    // something got changes or not will checked by below method 
    if (result.nModified === 0) {
        return res.status(404).json({ error: 'Message not found' });
    }

    return res.status(200).json({ message: 'Message deleted successfully' });

};
// delete the whole chat -- only done by owner 
export const deleteWholeChat = async (req,res)=>{
    const {teamspaceId} = req.params;
    if(!teamspace){
        return res.status(404).json({message:"teamspace not found"})
    }
    
    const teamspace = await Teamspace.findById(teamspaceId)
    if (teamspace.OwnerId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Only the owner can delete the chat' });
    }   
    // delete the whole chat if user is owner
    const result = await Chat.findByIdAndDelete({teamspaceId})
    if (!result) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      res.status(200).json({ message: 'Chat deleted successfully' });
}

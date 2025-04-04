import Teamspace from "../models/teamspace.model.js";
import Canvas from "../models/canvas.model.js";
import Chat from "../models/chat.model.js";
import Task from "../models/task.model.js"
import Notes from "../models/note.model.js"

const createTeamspace = async (req, res) => {
    const { teamspaceName } = req.body;
    const userId = req.user?.id; // Use req.user.id from JWT middleware


    // -----------------------------------------------------------
    // await Chat.collection.dropIndex("TeamspaceId_1");
    // -----------------------------------------------------------

    // Validate inputs
    if (!teamspaceName) {
        return res.status(400).json({ message: "Teamspace name is required" });
    }
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const alreadyExist = await Teamspace.find({
            teamspaceName: teamspaceName,
        });
        if(!alreadyExist){
            return res.status(400).json({message:"teamspace already exist"})
        }
        const teamspace = new Teamspace({
            teamspaceName: teamspaceName, // Match schema field name
            OwnerId: userId,
            members: [{ user: userId, role: "admin" }],
            tasks: [],
            notes: [],
        });
        await teamspace.save();

        console.log(teamspace._id);

        if (!teamspace) {
            return res
                .status(400)
                .json({ message: "Failed to create teamspace" });
        }
        const canvas = new Canvas({
            canvasData: {},
            teamspaceId: teamspace._id,
        });
        const chat = new Chat({
            teamspaceId: teamspace._id,
            messages: [],
        });

        await canvas.save();
        console.log(canvas);

        if (!canvas) {
            return res.status(400).json({ message: "Failed to create canvas" });
        }

        await chat.save();
        if (!chat) {
            return res.status(400).json({ message: "Failed to create chat" });
        }
        console.log(chat);
        teamspace.canvas = canvas._id;
        teamspace.chat = chat._id;
        await teamspace.save();

        console.log(teamspace);

        res.status(201).json({
            message: "Teamspace created successfully",
            teamspace,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}; // CHECKED

const getTeamspace = async (req, res) => {
    const { teamspaceId } = req.params;
    const userId = req.user?.id;

    console.log(userId);
    
    if (!teamspaceId) {
        return res.status(400).json({ message: "Teamspace not found" });
    }

    const currentTeamspace = await Teamspace.findById({ _id: teamspaceId })
        .populate("OwnerId", "username")
        .populate("members.user", "username")
        .populate("canvas")
        .populate("chat");


    if (!currentTeamspace) {
        return res.status(404).json({ message: "Teamspace does not exist" });
    }
    const isMember = currentTeamspace.members.some(
        (m) => m.user._id.toString() === userId
    );
    if (!isMember) {
        return res
            .status(401)
            .json({ message: "you're not a part of teamspace " });
    }

    return res.status(200).json({ currentTeamspace });
}; //CHECKED

const addMember = async (req, res) => {
    const { teamspaceId } = req.params;
    const { userIdToAdd } = req.body;
    const userId = req.user.id;
    console.log(userId);

    if (!teamspaceId) {
        return res.status(404).json({ error: "Teamspace not found" });
    }
    const teamspace = await Teamspace.findById(teamspaceId);

    const member = teamspace.members.find((m) => m.user.toString() === userId);
    console.log(member);
    
    if (!member || member.role !== "admin") {
        return res.status(403).json({ error: "Only admins can add members" });
    }
    if (teamspace.members.some((m) => m.user.toString() === userIdToAdd)) {
        return res.status(400).json({ error: "User already a member" });
    }

    teamspace.members.push({ user: userIdToAdd, role: "member" });
    await teamspace.save();

    res.status(200).json(teamspace);
}; // CHECKED

const removeMember = async (req, res) => {
    const { teamspaceId } = req.params;
    const { userToRemove } = req.body;
    const userId = req.user.id;

    if (!teamspaceId || !userToRemove || !userId) {
        return res.status(404).json({ message: "something is missing" });
    }
    const teamspace = await Teamspace.findById(teamspaceId);
    if (!teamspace) {
        return res.status(404).json({ message: "teamspace not found " });
    }
    const isMember = teamspace.members.find(
        (m) => m.user.toString() === userId
    );
    if (!isMember || isMember.role !== "admin") {
        return res.status(401).json({
            message: "you're don't have  access to remove any member",
        });
    }
    if (teamspace.OwnerId.toString() === userToRemove) {
        return res.status(400).json({ error: "Cannot remove the owner" });
    }
    teamspace.members = teamspace.members.filter(
        (m) => m.user.toString() !== userToRemove
    );
    await teamspace.save();

    res.status(200).json(teamspace);
}; // CHECKED

const deleteTeamspace = async (req, res) => {
    const { teamspaceId } = req.params;
    const userId = req.user?.id;

    if (!teamspaceId) {
        return res.status(400).json({ message: "Teamspace ID is required" });
    }
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }


    console.log(teamspaceId , userId);
    
    try {
        const teamspace = await Teamspace.findById(teamspaceId);
        if (!teamspace)
            return res.status(404).json({ error: "Teamspace not found" });
        if (teamspace.OwnerId.toString() !== userId) {
            return res
                .status(403)
                .json({ error: "Only the owner can delete the Teamspace" });
        }


        // Delete linked resources
        await Canvas.deleteOne({ _id: teamspace.canvas });
        await Chat.deleteOne({ _id: teamspace.chat });
        await Task.deleteMany({ _id: { $in: teamspace.tasks } });
        await Notes.deleteMany({ _id: { $in: teamspace.notes } });
        await Teamspace.deleteOne({ _id: teamspaceId });

        res.status(200).json({ message: "Teamspace deleted" });
    } catch (err) {
       console.log(err);
       throw new Error (err.message)
       
    }
}; // CHECKED 

export {
    createTeamspace,
    getTeamspace,
    addMember,
    removeMember,
    deleteTeamspace,
};

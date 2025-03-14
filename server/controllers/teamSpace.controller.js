import Teamspace from "../models/teamspace.model.js";
import Canvas from "../models/canvas.model.js";
import Chat from "../models/chat.model.js";

const createTeamspace = async (req, res) => {
    const { teamspaceName } = req.body;
    const OwnerId = req.user._id;

    if (!teamspaceName) {
        return res.status(404).json({ message: "name not found" });
    }

    try {
        const canvas = new Canvas({ teamspaceId: null }); // temporary
        const chat = new Chat({ teamspaceId: null }); // temporary
        await canvas.save();
        await chat.save();

        const teamspace = new Teamspace({
            teamspaceName,
            OwnerId,
            members: [{ user: OwnerId, role: "admin" }],
            canvas: canvas._id,
            chat: chat._id,
            tasks: [],
            notes: [],
        });
        await teamspace.save();

        canvas.teamspaceId = teamspace._id;
        await canvas.save();
        chat.teamspaceId = teamspace._id;
        await chat.save();

        res.status(201).json({
            message: "teamspace created successfully",
            teamspace,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};
const getTeamspace = async (req, res) => {
    const { teamspaceId } = req.params;
    const userId = req.user._id;

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
};
const addMember = async (req, res) => {
    const { teamspaceId } = req.params;
    const { userIdToAdd } = req.body;
    const userId = req.user._id;

    if (!teamspaceId) {
        return res.status(404).json({ error: "Teamspace not found" });
    }
    const teamspace = await Teamspace.findById(teamspaceId);

    const member = teamspace.find((m) => m.user.toString() === userId);

    if (!member || member.role !== "admin") {
        return res.status(403).json({ error: "Only admins can add members" });
    }
    if (teamspace.members.some((m) => m.user.toString() === userIdToAdd)) {
        return res.status(400).json({ error: "User already a member" });
    }

    teamspace.members.push({ user: userIdToAdd, role: "member" });
    await teamspace.save();

    res.status(200).json(teamspace);
};

const removeMember = async (req, res) => {
    const { teamspaceId } = req.params;
    const { userToRemove } = req.body;
    const userId = req.user._id;

    if (teamspaceId || userToRemove || userId) {
        return res.status(404).json({ message: "something is missing" });
    }
    const teamspace = await Teamspace.findById(teamspaceId);
    if (!teamspace) {
        return res.status(404).json({ message: "teamspace not found " });
    }
    const isMember = teamspace.members.some(
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
        (m) => m.user.toString() !== userIdToRemove
    );
    await teamspace.save();

    res.status(200).json(teamspace);
};

export const deleteTeamspace = async (req, res) => {
    const teamspaceId = req.params.teamspaceId;
    const userId = req.user.id;

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
        res.status(500).json({ error: err.message });
    }
};

export {
    createTeamspace,
    getTeamspace,
    addMember,
    removeMember,
    deleteTeamspace,
};

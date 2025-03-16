import Note from "../models/note.model.js";
import Teamspace from "../models/teamspace.model.js";

const createNote = async (req, res) => {
    const { title, content } = req.body;
    const { teamspaceId } = req.params;
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }
    if (!teamspaceId) {
        return res.status(400).json({ message: "Teamspace ID is required" });
    }

    const teamspace = await Teamspace.findById(teamspaceId);
    if (!teamspace) {
        return res.status(404).json({ message: "Teamspace not found" });
    }

    const note = new Note({
        createdBy: req.user._id,
        title,
        content,
        teamspace: teamspaceId,
    });

    await note.save();
    
    // Add note to teamspace's notes array
    await Teamspace.findByIdAndUpdate(teamspaceId, {
        $push: { notes: note._id }
    });

    res.status(201).json({ message: "Note created successfully", note });
};

const getNoteById = async (req, res) => {
    const { teamspaceId, noteId } = req.params;

    if (!teamspaceId || !noteId) {
        return res.status(400).json({ message: "Teamspace ID and Note ID are required" });
    }

    const note = await Note.findOne({ 
        _id: noteId,
        teamspace: teamspaceId 
    });

    if (!note) {
        return res.status(404).json({ message: "Note not found in this teamspace" });
    }
    res.status(200).json({ note });
};

const listNotesByTeamspace = async (req, res) => {
    const { teamspaceId } = req.params;

    if (!teamspaceId) {
        return res.status(400).json({ message: "Teamspace ID is required" });
    }

    const teamspace = await Teamspace.findById(teamspaceId).populate('notes');
    if (!teamspace) {
        return res.status(404).json({ message: "Teamspace not found" });
    }

    res.status(200).json({ notes: teamspace.notes });
};

const updateNote = async (req, res) => {
    const { teamspaceId, noteId } = req.params;
    const { title, content } = req.body;

    if (!teamspaceId || !noteId) {
        return res.status(400).json({ message: "Teamspace ID and Note ID are required" });
    }
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.findOneAndUpdate(
        {
            _id: noteId,
            teamspace: teamspaceId,
            createdBy: req.user._id,
        },
        { title, content },
        { new: true }
    );

    if (!note) {
        return res.status(404).json({ message: "Note not found in this teamspace" });
    }
    res.status(200).json({ message: "Note updated successfully", note });
};

const deleteNote = async (req, res) => {
    const { teamspaceId, noteId } = req.params;

    if (!teamspaceId || !noteId) {
        return res.status(400).json({ message: "Teamspace ID and Note ID are required" });
    }

    const deletedNote = await Note.findOneAndDelete({
        _id: noteId,
        teamspace: teamspaceId
    });

    if (!deletedNote) {
        return res.status(404).json({ message: "Note not found in this teamspace" });
    }

    // Remove note reference from teamspace
    await Teamspace.findByIdAndUpdate(teamspaceId, {
        $pull: { notes: noteId }
    });

    res.status(200).json({
        message: "Note deleted successfully",
        deletedNote,
    });
};

export {
    createNote,
    getNoteById,
    listNotesByTeamspace,
    updateNote,
    deleteNote,
};

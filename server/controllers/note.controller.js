import Note from "../models/note.model";
import Teamspace from "../models/teamspace.model";

const createNote = async (req, res) => {
    const { title, content } = req.body;
    const { teamspaceId } = req.params;
    if (!title || !content) {
        return res.status(404).json({ message: "something is missing" });
    }
    if (!teamspaceId) {
        return res.status(404).json({ message: "teamspace id is missing" });
    }
    const note = new Note({
        createdBy: req.user._id,
        title,
        content,
        teamspace: teamspaceId,
    });
    await note.save();
    res.json({ message: "note created successfully", note });
};

const getNoteById = async (req, res) => {
    const { noteId } = req.params;

    const note = await Note.findOne({ _id: noteId });

    if (!note) {
        return res.status(404).json({ message: "Note does not exist" });
    }
    res.status(200).json({ note });
};
const listNotesByTeamspace = async (req, res) => {
    const { teamSpaceId } = req.params;

    if (!teamSpaceId) {
        return res.status(404).json({ message: "Teamspace doesnt exist" });
    }
    const notesList = await Teamspace.findById({ _id: teamSpaceId });

    if (!notesList) {
        return res.status(200).json({ message: "No notes added YET" });
    }

    res.status(200).json({ notesList });
};
const updateNote = async (req, res) => {
    const { noteId } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(404).json({ message: "something is missing" });
    }
    const note = await Note.findOneAndUpdate(
        {
            _id: noteId,
            createdBy: req.user._id,
        },
        { title, content },
        { new: true }
    );
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note updated successfully", note });
};
const deleteNote = async (req, res) => {
    const { noteId } = req.params;
    if (!noteId) {
        return res.status(404).json({ message: "Note id not found" });
    }
    const deletedNote = await Note.findByIdAndDelete({ _id: noteId });

    if (!deletedNote) {
        return res
            .status(401)
            .json({ message: "something went wrong while deleting the note " });
    }

    res.status(201).json({
        message: "notes successfully deleted ",
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

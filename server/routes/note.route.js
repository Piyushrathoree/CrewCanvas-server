import { Router } from "express";

import {
    createNote,
    getNoteById,
    listNotesByTeamspace,
    updateNote,
    deleteNote,
} from "../controllers/note.controller.js";

import userMiddleware from "../middlewares/user.middleware.js";

const router = Router();

router.use(userMiddleware);

router.post("teamspace/:teamspaceId/create-note", createNote);
router.get("teamspace/:teamspaceId/note/:noteId", getNoteById);
router.get("teamspace/:teamspaceId/teamspace-notes", listNotesByTeamspace);
router.put("teamspace/:teamspaceId/update-note/:noteId", updateNote);
router.delete("teamspace/:teamspaceId/note-delete/:noteId", deleteNote);

export default router;

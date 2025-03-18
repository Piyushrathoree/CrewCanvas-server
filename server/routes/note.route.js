import { Router } from "express";

import {
    createNote,
    getNoteById,
    listNotesByTeamspace,
    updateNote,
    deleteNote,
} from "../controllers/note.controller.js";

import {verifyJWT} from "../middlewares/user.middleware.js";

const noteRouter = Router();

noteRouter.use(verifyJWT);

noteRouter.post("/:teamspaceId/create-note", createNote);
noteRouter.get("/:teamspaceId/note/:noteId", getNoteById);
noteRouter.get("/:teamspaceId/notes", listNotesByTeamspace);
noteRouter.put("/:teamspaceId/update-note/:noteId", updateNote);
noteRouter.delete("/:teamspaceId/delete-note/:noteId", deleteNote);

export default noteRouter;

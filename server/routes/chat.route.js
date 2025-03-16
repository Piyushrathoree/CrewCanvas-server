import { Router } from "express";

import {getChatByTeamspace,
    addMessageToChat,
    deleteMessage,
    deleteWholeChat} from '../controllers/chat.controller.js';

import userMiddleware from "../middlewares/user.middleware.js";

const router = Router();

// routes
router.post('/get-chat', userMiddleware, getChatByTeamspace);
router.post('/add-message', userMiddleware, addMessageToChat);     
router.put('/delete-message', userMiddleware, deleteMessage);
router.delete('/delete-chat', userMiddleware, deleteWholeChat);

export default router;
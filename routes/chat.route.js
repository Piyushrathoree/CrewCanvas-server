import { Router } from "express";

import {
    getChatByTeamspace,
    addMessageToChat,
    deleteMessage,
    
} from "../controllers/chat.controller.js";

import { verifyJWT } from "../middlewares/user.middleware.js";

const chatRouter = Router();

chatRouter.use(verifyJWT); // middleware
// routes
chatRouter.get("/:teamspaceId/get-chat", getChatByTeamspace);
chatRouter.put("/:teamspaceId/add-message", addMessageToChat);
chatRouter.put("/:teamspaceId/delete-message/:messageId", deleteMessage);
// chatRouter.delete("/:teamspaceId/delete-chat", deleteWholeChat);

export default chatRouter;

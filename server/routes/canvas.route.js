import Router from "express";

import {
    getCanvasByTeamspace,
    updateCanvasData,
} from "../controllers/canvas.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";

const router = Router();

router.get("/canvas/:teamspaceId", userMiddleware, getCanvasByTeamspace);

router.post("/canvas/:teamspaceId", userMiddleware, updateCanvasData);

export default router;

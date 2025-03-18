import Router from "express";

import {
    getCanvasByTeamspace,
    updateCanvasData,
} from "../controllers/canvas.controller.js";
import { verifyJWT } from "../middlewares/user.middleware.js";

const canvasRouter = Router();

canvasRouter.use(verifyJWT); // middleware

canvasRouter.get("/:teamspaceId/canvas", getCanvasByTeamspace);
canvasRouter.put("/:teamspaceId/canvas", updateCanvasData);

export default canvasRouter;

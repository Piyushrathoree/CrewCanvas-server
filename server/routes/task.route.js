import { Router } from "express";
import {
    createTask,
    getTask,
    updateTask,
    deleteTask,
    getTasksFromTeamspace,
    toggleTaskStatus,
} from "../controllers/task.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";
const router = Router();

router.use(userMiddleware);

//routes
router.post("/teamspace/:teamspaceId/create-task", createTask);
router.get("/teamspace/:teamspaceId/task/:taskId", getTask);
router.put("/teamspace/:teamspaceId/task/:taskId", updateTask);
router.delete("/teamspace/:teamspaceId/task/:taskId", deleteTask);
router.get("/teamspace/:teamspaceId/tasks", getTasksFromTeamspace);
router.put("/teamspace/:teamspaceId/task/:taskId/toggle-status", toggleTaskStatus);

export default router;
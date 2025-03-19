import { Router } from "express";
import {
    createTask,
    getTask,
    updateTask,
    deleteTask,
    getTasksFromTeamspace,
    toggleTaskStatus,
} from "../controllers/task.controller.js";
import {verifyJWT} from "../middlewares/user.middleware.js";

const taskRouter = Router();

taskRouter.use(verifyJWT);

//routes
taskRouter.post("/:teamspaceId/create-task", createTask);
taskRouter.get("/:teamspaceId/task/:taskId", getTask);
taskRouter.put("/:teamspaceId/task/:taskId", updateTask);
taskRouter.delete("/:teamspaceId/task/:taskId", deleteTask);
taskRouter.get("/:teamspaceId/tasks", getTasksFromTeamspace);
taskRouter.put("/:teamspaceId/task/:taskId/toggle-status", toggleTaskStatus);

export default taskRouter;
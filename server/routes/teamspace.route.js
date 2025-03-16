import { Router } from "express";

import {
    createTeamspace,
    getTeamspace,
    addMember,
    removeMember,
    deleteTeamspace,
} from "../controllers/teamspace.controller.js";

import userMiddleware from "../middlewares/user.middleware.js";

const router = Router();

// routes

router.post("/create-teampspace", userMiddleware, createTeamspace);
router.get("/my-teamspace", userMiddleware, getTeamspace);
router.put("/add-member", userMiddleware, addMember);
router.put("/remove-member", userMiddleware, removeMember);
router.delete("/delete-teamspace", userMiddleware, deleteTeamspace);


export default router;

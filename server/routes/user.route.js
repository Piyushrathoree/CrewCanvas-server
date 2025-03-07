import express from "express";
import { loginUser, logOut, RegisterUser } from "../controllers/user.controller.js";

const router= express.Router();

router.get("/", (_, res) => {
    res.send("hello , world");
});

router.post ("/register" , RegisterUser)
router.post("/login",loginUser)
router.post('/logout',logOut)

export default router;

import { Router } from "express";
import {
    registerUser,
    loginUser,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
} from "../controllers/user.controller.js";
import  { verifyJWT } from "../middlewares/user.middleware.js";

const router = Router();

//it is only for postman purpose
// router.get("/protected", userMiddleware, (req, res) => {
//     const user = req.user;
//     res.status(200).json({
//         success: true,
//         user,
//         message: "your are authenticated properly",
//     });
// });

// ✅ Normal Authentication Routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout); // --> dashboard in frontend

router.post("/verify-email", verifyEmail); //--> verify page
router.post("/forgot-password", forgotPassword); // --> forgot password page
router.post("/reset-password/:token", resetPassword); // --> reset password page
router.get("/protected", verifyJWT, (_, res) => {
    res.send(
        '<div style="background-color: black; color: white; height: 100vh; display: flex; justify-content: center; align-items: center;"><h1>your freaking middleware is working totally fine 😂☠️</h1> </div>'
    );
})
export default router;

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateVerificationCode } from "../utils/generateToken.js";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessfulEmail,
} from "../mail/emails.js";


export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send("Please fill all the fields");
    }
// -----------------------------------------------------
// await User.collection.dropIndex("name_1");
// ----------------------------------------------------


    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already exists");

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationCode();

    const user = new User({
        name,
        email,
        password: hashPassword,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    // directly authenticating user
    const token = user.generateAuthToken();

    if(!token) return res.status(500).json({ message: "Internal server error" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
    });

    await sendVerificationEmail(user.email, verificationToken);
    await user.save();
    res.status(200).json({
        message: "User registered successfully",
        user: {
            ...user._doc,
            password: undefined,
        },
    });
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.isPasswordCorrect(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = user.generateAuthToken();

        user.lastLogin = new Date();
        user.save();
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
        });
        res.status(200).json({
            user: {
                ...user._doc,
                password: undefined,
            },
            token,
            message: "User logged in successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (_, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).send("Please provide verification code");

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        user.isverified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({ messgae: "you're verified successfully" });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res
            .status(404)
            .json({ success: false, message: "email not found" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "user not found" });
        }

        //generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        //send email

        await sendPasswordResetEmail(
            user.email,
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        );

        res.status(200).json({
            success: true,
            message: "password reset link has been sent to your email",
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!token) {
        return res
            .status(404)
            .json({ success: false, message: "token not found" });
    }
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    //update password
    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.save();

    await sendResetSuccessfulEmail(user.email);

    res.status(200).json({
        success: true,
        message: "password reset successful",
    });
};

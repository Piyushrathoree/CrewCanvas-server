import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const userMiddleware = async (req, _, next) => {
    try {
        const { token } =
            req.cookies || req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("-password");
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        throw new Error("Not authorized, token failed");
    }
};
export default userMiddleware;



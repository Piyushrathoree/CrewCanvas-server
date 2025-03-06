import User from "../models/user.model.js";

const RegisterUser = async (req, res) => {
    const { email, name, password, picture } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error({ message: "User already exists" });
    }

    const user = new User({
        name: { firstName: name.firstName, lastName: name.lastName || "" },
        email,
        picture,
        password:await User.hashPassword(password),
    });

    if (!user) {
        return res.status(404).json({ message: "Register failed, Try again" });
    }
    await user.save();
    const finalUser = await User.findById(user._id).select("-password"); // go for proper reference
    res.status(201).json({ message: "Registered successfully", finalUser });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found, please register" });
    }

    try {
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        console.log("Password comparison result:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res
                .status(401)
                .json({ message: "Wrong password, please try again" });
        }

        const token = user.generateToken();
        const loggedUser = await User.findById(user._id).select("-password");

        res.status(200).json({
            message: "Login successful",
            token,
            loggedUser,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const logOut = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1] || req.cookies.token;
    if (!token) {
        return res.status(404).json({ message: "token not found" });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "logout successfully" });
};

export { logOut, loginUser, RegisterUser };

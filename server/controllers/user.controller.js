import User from "../models/user.model.js";

const RegisterUser = async (req, res) => {
    const { email, name, password, picture } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error({ message: "User already exists" });
    }

    const user = await User.create(name, email, password, picture);

    if (!user) {
        return res.status(404).json({ message: "Register failed, Try again" });
    }

    res.status(200).json({ message: "Registered succesfully", user });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw Error; // can be replaced with a proper error message

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res
            .status(404)
            .json({ message: "user not found , please register" });
    }
    const isPasswordCorrect = await User.matchPassword(password); //
    if (!isPasswordCorrect) {
        return res
            .status(401)
            .json({ message: "wrong password ,lease try again" });
    }
    const token = await User.generateToken();
    if (!token) {
        return res.status(404).json({ message: "token not found" });
    }
    res.status(200).json({ message: "login successfully ", token, user });
};
const logOut = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(404).json({ message: "token not found" });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "logout successfully" });
};

export { logOut, loginUser, RegisterUser };

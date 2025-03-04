import mongoose, { Schema, Types } from "mongoose";

const chatSchema = mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    TeamSpace: {
        type: Schema.Types.ObjectId,
        ref: "TeamSpace",
        required: true,
    },
    message: {
        type: String,
    },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;

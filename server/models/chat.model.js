import mongoose, { Schema, Types } from "mongoose";

const chatSchema = mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    TeamspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Teamspace",
        unique: true,
    },
    message: {
        type: String,
    },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;

import mongoose, { Schema, Types } from "mongoose";

const chatSchema = mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    TeamspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Teamspace",
        required: true,
    },
    message: {
        type: String,
    },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat
import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    teamspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Teamspace",
        unique: true,
        required: true,
    },
    messages: [
        {
            sender: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            }, // Each message has a sender
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],  
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;

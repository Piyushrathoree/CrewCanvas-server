import mongoose, { Schema } from "mongoose";

const chatSchema = mongoose.Schema({
    messages: [{
        sender: { type: Schema.Types.ObjectId, ref: 'User',required:true},
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }],
    TeamSpace: {
        type: Schema.Types.ObjectId,
        ref: "TeamSpace",
        required: true,
    },
    
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat
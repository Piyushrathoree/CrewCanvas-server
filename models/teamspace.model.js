import mongoose, { Schema } from "mongoose";

const teamSpaceSchema = new mongoose.Schema(
    {
        teamspaceName: {
            type: String,
            required: true,
        },
        OwnerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User" },
                role: {
                    type: String,
                    enum: ["admin", "member"],
                    default: "member",
                },
            },
        ],
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        canvas: {
            type: Schema.Types.ObjectId,
            ref: "Canvas",
            unique: true,
            // required: true,
        },
        chat: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            unique: true,
            // required: true,
        },
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],
        notes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Notes",
            },
        ],
    },
    { timestamps: true }
);

// Create and export the Teamspace model
const Teamspace = mongoose.model("Teamspace", teamSpaceSchema);
export default Teamspace;

import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        taskName: {
            type: String,
            required: true,
        },
        taskDescription: {
            type: String,
        },
        taskAssignedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        taskAssignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        taskStatus: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
        },
        teamspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Teamspace",
            required:true 
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;


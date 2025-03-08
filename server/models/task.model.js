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
            type: Schema.Type.ObjectId,
            ref: "User",
            required: true,
        },
        taskAssignedTo: {
            type: Schema.Type.ObjectId,
            ref: "User",
            required: true,
        },
        taskStatus: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;


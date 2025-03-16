import Task from "../models/task.model.js";
import Teamspace from "../models/teamspace.model.js";

const createTask = async (req, res) => {
    const { taskName, taskDescription, taskAssignedTo } = req.body;

    const taskAssignedBy = req.user._id;

    const { teamspaceId } = req.params;
    if (!teamspaceId) {
        return res.status(404).json({ message: "Teamspace not found" });
    }
    const currentTeamspace = await Teamspace.findById(teamspaceId);
    if (!currentTeamspace) {
        return res.status(404).json({ message: "Teamspace not found" });
    }

    const taskExists = await Task.findOne({ taskName });

    if (taskExists) {
        return res
            .status(401)
            .json({ message: "Task with a same name Already exists " });
    }

    const task = new Task({
        taskName,
        taskDescription,
        taskAssignedTo,
        taskAssignedBy,
        teamspaceId,
    });

    if (!task) {
        return res.status(401).json({ message: "Error in creating a T sk" });
    }
    await task.save();
    
    // Add note to teamspace's notes array
    await Teamspace.findByIdAndUpdate(teamspaceId, {
        $push: { notes: note._id },
    });
    res.status(201).json({ message: "Task Created successfully", task });
};

const getTask = async (req, res) => {
    const { teamspaceId, taskId } = req.params;

    if (!teamspaceId || !taskId) {
        return res
            .status(404)
            .json({ message: "Teamspace ID or Task ID not provided" });
    }

    const teamspace = await Teamspace.findById(teamspaceId);
    if (!teamspace) {
        return res.status(404).json({ message: "Teamspace not found" });
    }

    const task = await Task.findOne({
        _id: taskId,
        teamspaceId: teamspaceId,
    });

    if (!task) {
        return res
            .status(404)
            .json({ message: "Task not found in this teamspace" });
    }

    res.status(200).json({ task });
};

const getTasksFromTeamspace = async (req, res) => {
    const { teamspaceId } = req.params;
    if (!teamspaceId) {
        return res.status(404).json({ message: "teamspace not found" });
    }
    const currentTeamspace = await Teamspace.find({ _id: teamspaceId });
    if (!currentTeamspace) {
        return res.status(200).json({ message: "No notes added YET" });
    }

    res.status(200).json({ tasks: currentTeamspace.tasks });
};

const updateTask = async (req, res) => {
    const { teamspaceId, taskId } = req.params;
    const { taskName, taskDescription } = req.body;

    if (!teamspaceId || !taskId) {
        return res
            .status(404)
            .json({ message: "Teamspace ID or Task ID not provided" });
    }

    const teamspace = await Teamspace.findById(teamspaceId);
    if (!teamspace) {
        return res.status(404).json({ message: "Teamspace not found" });
    }

    if (!taskName || !taskDescription) {
        return res
            .status(400)
            .json({ message: "Task name and description are required" });
    }

    const task = await Task.findOneAndUpdate(
        {
            _id: taskId,
            teamspaceId: teamspaceId,
            taskAssignedBy: req.user._id,
        },
        { taskName, taskDescription },
        { new: true }
    );

    if (!task) {
        return res
            .status(404)
            .json({ message: "Task not found in this teamspace" });
    }

    res.status(200).json({ message: "Task Updated Successfully", task });
};

const deleteTask = async (req, res) => {
    const { teamspaceId, taskId } = req.params;

    if (!teamspaceId || !taskId) {
        return res
            .status(404)
            .json({ message: "Teamspace ID or Task ID not provided" });
    }

    const teamspace = await Teamspace.findById(teamspaceId);
    if (!teamspace) {
        return res.status(404).json({ message: "Teamspace not found" });
    }

    const deletedTask = await Task.findOneAndDelete({
        _id: taskId,
        teamspaceId: teamspaceId,
    });

    if (!deletedTask) {
        return res
            .status(404)
            .json({ message: "Task not found in this teamspace" });
    }

    // Remove task reference from teamspace
    await Teamspace.findByIdAndUpdate(teamspaceId, {
        $pull: { tasks: taskId },
    });

    res.status(200).json({
        message: "Task successfully deleted",
        deletedTask,
    });
};

const toggleTaskStatus = async (req, res) => {
    const { teamspaceId, taskId } = req.params;

    if (!teamspaceId || !taskId) {
        return res
            .status(404)
            .json({ message: "Teamspace ID or Task ID not provided" });
    }

    const teamspace = await Teamspace.findById(teamspaceId);
    if (!teamspace) {
        return res.status(404).json({ message: "Teamspace not found" });
    }

    const task = await Task.findOne({ _id: taskId, teamspaceId: teamspaceId });
    if (!task) {
        return res
            .status(404)
            .json({ message: "Task not found in this teamspace" });
    }

    const newStatus = task.taskStatus === "Pending" ? "Completed" : "Pending";
    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { taskStatus: newStatus },
        { new: true }
    );

    res.status(200).json({
        message: "Task status updated successfully",
        task: updatedTask,
    });
};

export {
    createTask,
    getTask,
    updateTask,
    deleteTask,
    getTasksFromTeamspace,
    toggleTaskStatus,
};

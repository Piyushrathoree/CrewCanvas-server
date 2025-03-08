import Task from "../models/task.model.js";
import Teamspace from "../models/teamSpace.model.js";

const createTask = async (req, res) => {
    const { taskName, taskDescription, taskAssignedTo } = req.body;

    const taskAssignedBy = req.user._id;

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
    });

    if (!task) {
        return res.status(401).json({ message: "Error in creating a T sk" });
    }
    await task.save();
    res.status(201).json({ message: "Task Created successfully", task });
};

const getTask = async (req, res) => {
    const { taskId } = req.params;
    if (!taskId) {
        return res.status(404).json({ message: "Task id is missing" });
    }
    const task = await Task.findById(taskId);
    if (!task) {
        res.status(404).json({ message: "task not found" });
    }
    res.status(200).json(task);
};
const getTasksFromTeamspace = async (req, res) => {
    const { teamspcaeId } = req.params;
    if (!teamspcaeId) {
        return res.status(404).json({ message: "teamspace not found" });
    }
    const currentTeamspace = await Teamspace.find({ _id: teamspcaeId });
    if (!currentTeamspace) {
        return res.status(200).json({ message: "No notes added YET" });
    }

    res.status(200).json({ tasks: currentTeamspace.tasks });
};

const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { taskName, taskDescription } = req.body;

    if (!taskId) {
        return res.status(404).json({ message: "Task id not found " });
    }

    if (!taskName || !taskDescription) {
        return res.status(404).json({ message: "No such task exists" });
    }

    const task = await Task.findOneAndUpdate(
        {
            _id: taskId,
            createdBy: req.user._id,
        },
        { taskName, taskDescription },
        { new: true }
    );

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task Updated Successfullly" });
};

const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    if (!taskId) {
        return res.status(404).json({ message: "task id not found " });
    }
    const deletedTask = await Task.findByIdAndDelete({ taskId });

    if (!deleteTask) {
        return res
            .status(401)
            .json({ message: "something went wrong while deleting the task " });
    }

    res.status(201).json({
        message: "notes successfully deleted ",
        deletedTask,
    });
};

const toggleStatus = async () => {};

export { createTask, getTask, updateTask, deleteTask, getTasksFromTeamspace };

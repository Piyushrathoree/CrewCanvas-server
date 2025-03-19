import Canvas from "../models/canvas.model.js";
import Teamspace from "../models/teamspace.model.js";

const getCanvasByTeamspace = async (req, res) => {
    const { teamspaceId } = req.params;
    if (!teamspaceId) {
        return res.status(404).json({ message: "teamspace does not exist" });
    }

    const teamspace = await Teamspace.findOne({ _id: teamspaceId });
    if (!teamspace) {
        return res.status(401).json({ message: "Error fetching Team Space" });
    }

    const isMember = teamspace.members.some(
        (member) => member.user.toString() === req.user.id
    );
    if (!isMember) {
        return res
            .status(402)
            .json({ message: "User not a part of the Team Space" });
    }

    const canvas = await Canvas.findOne({ teamspaceId });
    if (!canvas) {
        return res.status(401).json({ message: "Canvas not available" });
    }

    res.status(200).json({ message: "canvas fetched successfully ", canvas });
}; // checked 

const updateCanvasData = async (req, res) => {
    const { data } = req.body;
    const { teamspaceId } = req.params;
    if (!data) {
        return res.status(404).json({ message: "data not found" });
    }

    const teamspace = await Teamspace.findOne({ _id: teamspaceId });
    if (!teamspace) {
        return res.status(404).json({ message: "teamspace not found" });
    }
    const isMember = teamspace.members.some(
        (member) => member.user.toString() === req.user.id
    );
    if (!isMember) {
        return res
            .status(401)
            .json({ message: "User not a part of the teamspace" });
    }
    let canvas = await Canvas.findOne({ teamspaceId });
    if (!canvas) {
        canvas = new Canvas({ teamspaceId, canvasData: data });
    } else {
        canvas.canvasData = data;
        canvas.updatedAt = Date.now();
    }
    await canvas.save();
    res.status(200).json({ message: "Canvas updated successfully" });
}; // checked 

export { getCanvasByTeamspace, updateCanvasData };

import Canvas from "../models/canvas.model";
import Teamspace from "../models/teamSpace.model";

const getCanvasByTeamspace = async (req, res) => {
    const { teamSpaceId } = req.params;
    if (!teamSpaceId) {
        return res.status(404).json({ message: "TeamSpace does not exist" });
    }

    const teamSpace = await Teamspace.findOne({ _id: teamSpaceId });
    if (!teamSpace) {
        return res.status(401).json({ message: "Error fetching Team Space" });
    }

    const isMember = teamSpace.members.some(
        (member) => member.user.toString() === req.user._id
    );
    if (!isMember) {
        return res
            .status(402)
            .json({ message: "User not a part of the Team Space" });
    }

    const canvas = await Canvas.findOne({ teamSpaceId });
    if (!canvas) {
        return res.status(401).json({ message: "Canvas not available" });
    }

    res.status(200).json({ message: { canvas } });
};

const updateCanvasData = async (req, res) => {
    const { data } = req.body;
    const { teamSpaceId } = req.params;
    if (!data) {
        return res.status(404).json({ message: "data not found" });
    }

    const teamspace = await Teamspace.findOne({ _id: teamSpaceId });
    if (!teamspace) {
        return res.status(404).json({ message: "TeamSpace not found" });
    }
    const isMember = teamspace.members.some(
        (member) => member.user.toString() === req.user._id
    );
    if (!isMember) {
        return res
            .status(401)
            .json({ message: "User not a part of the TeamSpace" });
    }
    let canvas = await Canvas.findOne({ teamSpaceId });
    if (!canvas){
        canvas = new Canvas({ teamSpaceId, canvasData: data });
    } else {
        canvas.data = data;
        canvas.updatedAt = Date.now();
    }
    await canvas.save();
    res.status(200).json({ message: "Canvas updated successfully" });
    
};


export { getCanvasByTeamspace, updateCanvasData };

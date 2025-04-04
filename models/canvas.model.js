import mongoose ,{ Schema } from "mongoose";


// Define the Canvas schema
const canvasSchema = new Schema({
    canvasData: {
        type: Schema.Types.Mixed, // Stores the entire canvas state as a JSON object
        required: true,
        default: () => ({}), // Default to an empty object if no data exists
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    lastEditedBy: {
        // Optional: Track the last user who edited
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    teamspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Teamspace",
        unique:true,
        required :true
    }
});

// Pre-save hook to update the updatedAt field
canvasSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});


// // Method to ensure only one canvas exists for a given name
// // This is useful for maintaining a single instance of a canvas in the database
// // If a canvas with the given name doesn't exist, it creates a new one
// // If it exists, it returns the existing canvas
// // This prevents multiple canvases with the same name from being created
// canvasSchema.statics.ensureSingleCanvas = async function (name = "MainCanvas") {
//     let canvas = await this.findOne({ name });
//     if (!canvas) {
//         canvas = new this({
//             name,
//             canvasData: {}, // Start with an empty canvas
//         });
//         await canvas.save();
//     }
//     return canvas;
// };

// Method to update canvas data
canvasSchema.methods.updateCanvasData = async function (newData, userId) {
    this.canvasData = newData; // Replace with new state
    this.lastEditedBy = userId; // Optional: Track who edited
    this.markModified("canvasData"); // Required for Mixed type updates
    await this.save();
    return this;
};

// Create and export the Canvas model
const Canvas = mongoose.model("Canvas", canvasSchema);
export default Canvas

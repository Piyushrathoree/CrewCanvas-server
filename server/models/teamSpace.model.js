
import mongoose, { Schema } from "mongoose";

const teamSpaceSchema = new mongoose.Schema({
    projectName: {
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
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    // // Optional fields for related data : can be implemented later 
    // notes: [ // note model 
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "note", // Reference to the Document model
    //     },
    // ],
    // canvas://  canvas only one for a team global 
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "canvas", // Reference to the Project model
    //     },
    
    // chat: // chat model single for a team
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "chat", // Reference to the Message model
    //     },

    //       role: {
    //             type: String,
    //             enum: ["admin", "member"],
    //             default: "member",
    //         },
    //     },
    // ],
});

// Pre-save hook to update the updatedAt field
teamSpaceSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create and export the Teamspace model
const Teamspace = mongoose.model("Teamspace", teamSpaceSchema);
export default Teamspace;


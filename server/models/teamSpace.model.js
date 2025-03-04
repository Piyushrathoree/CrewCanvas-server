import mongoose ,{Schema}from "mongoose";


// Define the Teamspace schema
const teamspaceSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    // // Optional fields for related data : can be implemented later 
    // documents: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Document", // Reference to the Document model
    //     },
    // ],
    // projects: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Project", // Reference to the Project model
    //     },
    // ],
    // messages: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Message", // Reference to the Message model
    //     },
    // ],
    // members: [
    //     {
    //         user: {
    //             type: Schema.Types.ObjectId,
    //             ref: "User", // Reference to the User model
    //         },
    //         role: {
    //             type: String,
    //             enum: ["admin", "member", "viewer"],
    //             default: "member",
    //         },
    //     },
    // ],
});

// Pre-save hook to update the updatedAt field
teamspaceSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create and export the Teamspace model
const Teamspace = mongoose.model("Teamspace", teamspaceSchema);
export default Teamspace;

import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
    {
        teamspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Teamspace",
            index: true, // Added for faster queries by teamspace
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxLength: 200, // Reasonable title limit
        },
        content: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return v.length <= 100000; // ~10,000 words max (conservative estimate)
                },
                message:
                    "Content exceeds maximum allowed length (approx. 10,000 words)",
            },
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Update timestamp on save
noteSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for efficient retrieval
noteSchema.index({ teamspaceId: 1, createdAt: 1 });

const Note = mongoose.model("Notes", noteSchema);
export default Note;

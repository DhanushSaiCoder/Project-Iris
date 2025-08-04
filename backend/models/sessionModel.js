import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        uniqueObjects: {
            type: Number,
            required: true,
        },
        totalDetections: {
            type: Number,
            required: true,
        },
        allDetections: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Session", SessionSchema);

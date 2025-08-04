import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        noOfAlerts: {
            type: Number,
            default: 0,
        },
        abstraclesDetected: {
            type: Number,
            default: false,
        },
        objectsDetected: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Session", SessionSchema);

// models/Session.js
import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    duration: { type: Number, required: true },
    uniqueObjects: { type: Number, required: true },
    totalDetections: { type: Number, required: true },
    allDetections: [
        {
            class: String,
            confidence: Number,
            timestamp: String,
        },
    ],
}, { timestamps: true });

export default mongoose.model("Session", sessionSchema);

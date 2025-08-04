import express from "express";
import Session from "../models/sessionModel.js";

const router = express.Router();

// POST: Create a new summary
router.post("/", async (req, res) => {
    try {
        const {
            userId,
            duration,
            uniqueObjects,
            totalDetections,
            allDetections,
        } = req.body;

        if (
            !userId ||
            duration === undefined ||
            uniqueObjects === undefined ||
            totalDetections === undefined ||
            !Array.isArray(allDetections)
        ) {
            return res.status(400).json({
                message: "Send all required fields: userId, duration, uniqueObjects, totalDetections, allDetections",
            });
        }

        const newSession = {
            userId,
            duration,
            uniqueObjects,
            totalDetections,
            allDetections,
        };

        const session = await Session.create(newSession);
        return res.status(201).json(session);
    } catch (err) {
        console.error("Error creating session:", err.message);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET: Fetch all summaries
router.get("/", async (req, res) => {
    try {
        const sessions = await Session.find({});
        return res.status(200).json({ Count: sessions.length, data: sessions });
    } catch (err) {
        console.error("Error retrieving sessions:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET: Fetch summary by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        return res.status(200).json(session);
    } catch (err) {
        console.error("Error retrieving session:", err.message);
        res.status(500).send({ error: err.message });
    }
});

export default router;

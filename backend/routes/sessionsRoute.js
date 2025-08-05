import express from "express";
import Session from "../models/sessionModel.js";

const router = express.Router();

// POST: Create a new summary
router.post("/", async (req, res) => {
    try {
        console.log("Incoming POST data:", req.body); // Add this
        const { userId, duration, uniqueObjects, totalDetections, allDetections } = req.body;

        if (!userId || !duration || !Array.isArray(allDetections)) {
            return res.status(400).json({ error: "Invalid or missing data" });
        }

        const newSession = new Session({
            userId,
            duration,
            uniqueObjects,
            totalDetections,
            allDetections,
        });

        await newSession.save();
        res.status(201).json({ message: "Session saved", session: newSession });
    } catch (err) {
        console.error("Error saving session:", err); // Log the full error
        res.status(500).json({ error: "Internal Server Error" });
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

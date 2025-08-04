import express from "express";
import Session from "../models/sessionModel.js";

const router = express.Router();

// POST: Create a new session
router.post("/", async (req, res) => {
    try {
        const {
            userId,
            startTime,
            endTime,
            noOfAlerts,
            abstraclesDetected,
            objectsDetected,
        } = req.body;

        if (
            !userId ||
            !startTime ||
            !endTime ||
            noOfAlerts === undefined ||
            abstraclesDetected === undefined ||
            !Array.isArray(objectsDetected)
        ) {
            return res.status(400).json({
                message: "Send all required fields: userId, startTime, endTime, noOfAlerts, abstraclesDetected, objectsDetected",
            });
        }

        const newSession = {
            userId,
            startTime,
            endTime,
            noOfAlerts,
            abstraclesDetected,
            objectsDetected,
        };

        const session = await Session.create(newSession);
        return res.status(201).json(session);
    } catch (err) {
        console.error("Error creating session:", err.message);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET: Fetch all sessions
router.get("/", async (req, res) => {
    try {
        const sessions = await Session.find({});
        return res.status(200).json({ Count: sessions.length, data: sessions });
    } catch (err) {
        console.error("Error in retrieving sessions:", err.message);
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({ message: "session not found" });
        }

        return res.status(200).json(session);
    } catch (err) {
        console.error("Error retrieving book:", err.message);
        res.status(500).send({ error: err.message });
    }
});

export default router;

import express from "express";
import { createSession, getAllSessions, getSessionById, importGuestSessions } from "../controllers/sessionController.js";

const router = express.Router();

// POST: Create a new summary
router.post("/", createSession);

// POST: Import guest sessions
router.post("/guest-import", importGuestSessions);

// GET: Fetch all summaries
router.get("/", getAllSessions);

// GET: Fetch summary by ID
router.get("/:id", getSessionById);

export default router;

import express from "express";
import * as sessionController from '../Controllers/sessionController.js';

const router = express.Router();

// POST: Create a new summary
router.post("/", sessionController.createSession);

// POST: Import guest sessions
router.post("/guest-import", sessionController.importGuestSessions);

// GET: Fetch all summaries
router.get("/", sessionController.getAllSessions);

// GET: Fetch summary by ID
router.get("/:id", sessionController.getSessionById);

export default router;

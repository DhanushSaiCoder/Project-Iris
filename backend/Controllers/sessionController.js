import Session from "../models/sessionModel.js";

export const createSession = async (req, res) => {
    try {
        console.log("Incoming POST data:", req.body); // Add this
        const { userId, duration, totalDetections, allDetections } = req.body;

        if (!userId || !duration || !Array.isArray(allDetections)) {
            return res.status(400).json({ error: "Invalid or missing data" });
        }

        const uniqueObjectClasses = new Set(allDetections.map(d => d.class));
        const uniqueObjects = uniqueObjectClasses.size;

        console.log("Unique object classes:", uniqueObjectClasses);
        console.log("Number of unique objects:", uniqueObjects);

        const newSession = new Session({
            userId,
            duration,
            uniqueObjects, // calculated value
            totalDetections,
            allDetections,
        });

        await newSession.save();
        res.status(201).json({ message: "Session saved", session: newSession });
    } catch (err) {
        console.error("Error saving session:", err); // Log the full error
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllSessions = async (req, res) => {
    try {
                const sessions = await Session.find({}).populate('userId', '-password');
        return res.status(200).json({ Count: sessions.length, data: sessions });
    } catch (err) {
        console.error("Error retrieving sessions:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getSessionById = async (req, res) => {
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
};

export const importGuestSessions = async (req, res) => {
    try {
        const { userId, guestSessions } = req.body;

        if (!userId || !Array.isArray(guestSessions)) {
            return res.status(400).json({ message: "Invalid data for guest session import." });
        }

        const sessionsToSave = guestSessions.map(session => ({
            ...session,
            userId: userId, // Assign the new user's ID to these sessions
        }));

        await Session.insertMany(sessionsToSave);

        res.status(200).json({ message: `Successfully imported ${sessionsToSave.length} guest sessions.` });
    } catch (error) {
        console.error("Error importing guest sessions:", error);
        res.status(500).json({ message: "Failed to import guest sessions." });
    }
};

export const getUniqueObjects = async (req, res) => {
    try {
        const sessions = await Session.find({});
        const allDetections = sessions.flatMap(session => session.allDetections);
        const objectCounts = allDetections.reduce((acc, { class: cls }) => {
            acc[cls] = (acc[cls] || 0) + 1;
            return acc;
        }, {});

        const uniqueObjectsWithCounts = Object.entries(objectCounts).map(([name, count]) => ({ name, count }));
        
        res.status(200).json({ uniqueObjects: uniqueObjectsWithCounts });
    } catch (err) {
        console.error("Error retrieving unique objects:", err.message);
        res.status(500).json({ error: err.message });
    }
};
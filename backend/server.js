import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import sessionsRoute from './routes/sessionsRoute.js'
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";


dotenv.config({
    path: path.resolve(__dirname, envFile),
});

const mongodbURL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5555;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    return res.status(200).send("Welcome to Project Iris");
});

app.use('/session', sessionsRoute)


// Database Connection and Server Start
const connectDB = async () => {
    try {
        await mongoose.connect(mongodbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database connected");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
};

connectDB();

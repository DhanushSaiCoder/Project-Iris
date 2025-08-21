import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import sessionsRoute from './routes/sessionsRoute.js';
import authRoutes from './routes/Auth.route.js';
import userRoutes from './routes/user.route.js';
import path from "path";
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";

dotenv.config({
  path: path.resolve(__dirname, envFile),
});

const mongodbURL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5555;

if (!mongodbURL) {
  console.error("MONGODB_URL is undefined. Check your environment file.");
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors());



// Routes
app.use('/auth', authRoutes);
app.use('/session', sessionsRoute);
app.use('/api/users', userRoutes);

// Serve frontend
if (process.env.NODE_ENV === 'testing') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// Database connection and server start
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL, {})
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

connectDB();

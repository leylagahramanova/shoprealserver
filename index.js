// server/index.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/database.js'; // Ensure the path is correct
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';

dotenv.config();

// Connect to database and sync models
connectToDatabase(); // Ensure this function call is correct

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", tasksRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

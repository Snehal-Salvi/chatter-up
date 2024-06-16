import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import roomsRouter from "./routes/rooms.routes.js";

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/user', userRoutes); 
// Use the rooms route
app.use("/rooms", roomsRouter);

// Connect to the database
connectDB();

 

export default app;

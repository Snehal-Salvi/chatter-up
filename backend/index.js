import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/user', userRoutes); 

// Connect to the database
connectDB();

// Define a route for fetching rooms (optional)
app.get('/rooms', (req, res) => {
    const rooms = ['general', 'tech', 'finance', 'crypto'];
    res.json(rooms);
});

export default app;

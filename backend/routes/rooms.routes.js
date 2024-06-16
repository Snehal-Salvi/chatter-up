// routes/rooms.js
import express from "express";
import { createRoom, deleteRoom, getRooms } from "../controllers/rooms.controller.js";
 

const router = express.Router();

// Define the route to create a new room
router.post("/", createRoom);

// Define the route to get all rooms
router.get("/", getRooms);

// Define the route to delete a room
router.delete("/:roomName", deleteRoom);

export default router;

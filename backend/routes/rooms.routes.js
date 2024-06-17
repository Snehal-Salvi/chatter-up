import express from "express";
import {
  createRoom,
  deleteRoom,
  getRooms,
} from "../controllers/rooms.controller.js";

const router = express.Router();

// POST route to create a new room
router.post("/", createRoom);

// GET route to fetch all rooms
router.get("/", getRooms);

// DELETE route to delete a room by ID
router.delete("/:id", deleteRoom);

export default router;

// controllers/room.controller.js

import Room from "../models/room.model.js";

 

// Controller to create a new room
export const createRoom = async (req, res) => {
  try {
    const { roomName } = req.body;
    const newRoom = new Room({ name: roomName });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ error: "Room creation failed" });
  }
};

// Controller to get all rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// Controller to delete a room
export const deleteRoom = async (req, res) => {
  try {
    const { roomName } = req.params;
    await Room.findOneAndDelete({ name: roomName });
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room" });
  }
};

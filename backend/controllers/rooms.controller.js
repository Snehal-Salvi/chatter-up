import Room from "../models/room.model.js";

// Controller function to create a new room
export const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const newRoom = new Room({ name }); // Create a new Room instance
    await newRoom.save(); // Save the new room to the database
    res.status(201).json(newRoom); // Respond with the newly created room
  } catch (error) {
    res.status(400).json({ error: "Room creation failed" }); // Handle error if room creation fails
  }
};

// Controller function to get all rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find(); // Retrieve all rooms from the database
    res.status(200).json(rooms); // Respond with the list of rooms
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" }); // Handle error if fetching rooms fails
  }
};

// Controller function to delete a room by ID
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await Room.findByIdAndDelete(id); // Find and delete the room by its ID
    res.status(200).json({ message: "Room deleted successfully" }); // Respond with success message
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room" }); // Handle error if deleting room fails
  }
};

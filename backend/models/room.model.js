import mongoose from "mongoose";

// Define the schema for a room, including its name and messages array
const roomSchema = new mongoose.Schema({
  name: String,
  messages: [
    {
      sender: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);

export default Room;

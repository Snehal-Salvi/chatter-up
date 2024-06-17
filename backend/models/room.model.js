import mongoose from "mongoose";

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

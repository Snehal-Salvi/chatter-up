import { createServer } from "http";
import { Server } from "socket.io";
import app from "./index.js"; // Import the express app
import {
  getLastMessagesFromRoom,
  sortRoomMessagesByDate,
} from "./controllers/message.controller.js";
import Message from "./models/mesaage.model.js";
import User from "./models/user.model.js";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const rooms = ["Room 1", "Room 2", "Room 3", "Room 4"];

// Socket connection
io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  socket.on("join-room", async (newRoom, previousRoom) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });

  socket.on("logout", async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      const user = await User.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

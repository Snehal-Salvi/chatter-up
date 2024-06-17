import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import Room from "./models/room.model.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import roomsRouter from "./routes/rooms.routes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("App is working");
});

app.use("/api/user", userRoutes);

app.use("/api/rooms", roomsRouter);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", async (roomId) => {
    socket.join(roomId);
    const room = await Room.findById(roomId);
    if (room) {
      socket.emit("roomData", room);
    }
  });

  socket.on("sendMessage", async (roomId, message, sender) => {
    const newMessage = {
      sender,
      text: message,
      createdAt: new Date(),
      read: false,
    };
    const room = await Room.findByIdAndUpdate(
      roomId,
      {
        $push: { messages: newMessage },
      },
      { new: true }
    );
    io.to(roomId).emit("message", newMessage);
  });

  socket.on("typing", (roomId, userName) => {
    socket.to(roomId).emit("typing", userName);
  });

  socket.on("stopTyping", (roomId) => {
    socket.to(roomId).emit("stopTyping");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

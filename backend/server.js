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
    origin: "https://chatter-up-frontend.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB(); // Connect to the database

// Test route to verify the app is working
app.get("/", (req, res) => {
  res.send("App is working");
});

// Routes for user authentication
app.use("/api/user", userRoutes);

// Routes for managing rooms
app.use("/api/rooms", roomsRouter);

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle 'join' event when a user joins a room
  socket.on("join", async (roomId) => {
    socket.join(roomId); // Join the specified room
    const room = await Room.findById(roomId); // Find the room by ID in the database
    if (room) {
      socket.emit("roomData", room); // Emit 'roomData' event with room details to the connected socket
    }
  });

  // Handle 'sendMessage' event when a user sends a message to a room
  socket.on("sendMessage", async (roomId, message, sender) => {
    const newMessage = {
      sender,
      text: message,
      createdAt: new Date(),
      read: false,
    };
    // Update the room in the database to add the new message
    const room = await Room.findByIdAndUpdate(
      roomId,
      {
        $push: { messages: newMessage },
      },
      { new: true }
    );
    io.to(roomId).emit("message", newMessage); // Emit 'message' event to all sockets in the room
  });

  // Handle 'typing' event when a user starts typing in a room
  socket.on("typing", (roomId, userName) => {
    socket.to(roomId).emit("typing", userName); // Emit 'typing' event to all other sockets in the room
  });

  // Handle 'stopTyping' event when a user stops typing in a room
  socket.on("stopTyping", (roomId) => {
    socket.to(roomId).emit("stopTyping"); // Emit 'stopTyping' event to all other sockets in the room
  });

  // Handle 'disconnect' event when a user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3002; // Use the specified port or default to 3002
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

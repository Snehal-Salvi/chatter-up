import express from "express";
import {
  createRoom,
  deleteRoom,
  getRooms,
} from "../controllers/rooms.controller.js";

const router = express.Router();

router.post("/", createRoom);
router.get("/", getRooms);
router.delete("/:id", deleteRoom);

export default router;

import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app = express();

const sercver = http.createServer(app);
const port = process.env.PORT || 5000;

const io = new Server(sercver, {
  cors: {
    origin: process.env.NEXT_BASE_URL,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected with ID:", socket.id);

  socket.on("identity", async (userId) => {
    console.log("User identified with ID:", userId);
    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`, {
      userId,
      socketId: socket.id,
    });
  });
  socket.on("disconnect", () => {
    console.log("user disconnected with ID:", socket.id);
  });
});

sercver.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

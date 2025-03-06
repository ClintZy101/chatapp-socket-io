const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust to match your frontend port
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.get("/", (req, res) => {
  res.send("Server is running");
}); 


io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // socket.on("join_room", (data) => {
  //   socket.join(data);
  // });


  // socket.on("send_message", (data) => {
  //   io.emit("receive_message", data.message);
  // });

  socket.on("join_room", (roomNumber) => {
    socket.join(roomNumber);
    console.log(`User with ID: ${socket.id} joined room: ${roomNumber}`);
  });

  socket.on("send_message", (data) => {
    const { message, roomNumber } = data;
    io.to(roomNumber).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});

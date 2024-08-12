const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the frontend
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("socket connected on ", socket.id);

  //join channel event
  socket.on("joinChannel", ({ userId }) => {
    socket.join(userId);
    console.log("user joined to ", userId);

    //load previous message for connected channel
    socket.emit("loadMessage", userId);
  });

  //send message event
  socket.on("sendMessage", ({ userId, message }) => {
    console.log("message in server:", message);
    io.to(userId).emit("receiveMessage", { userId, message });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected from ", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log("server is running on ", PORT));

// Main server
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const path = require("path");

// serve frontend files
app.use(express.static(path.join(__dirname, "../view")));

// Basic health check
app.get("/", (req, res) => res.send("Chat server running"));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    console.log(username + " joined " + room);
  });

  socket.on("leaveRoom", ({ username, room }) => {
    socket.leave(room);
    console.log(username + " left " + room);
  });

  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    server.listen(PORT, () =>
      console.log(`Server listening on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("Failed to connect MongoDB:", err.message);
    process.exit(1);
  });

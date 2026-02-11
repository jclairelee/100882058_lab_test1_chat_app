// Main server
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const GroupMessage = require("./models/GroupMessage");
const PrivateMessage = require("./models/PrivateMessage");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const messageRoutes = require("./routes/messages");
app.use("/api/messages", messageRoutes);

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

const path = require("path");

// serve frontend files
app.use(express.static(path.join(__dirname, "../view")));

// Basic health check
app.get("/", (req, res) => res.send("Chat server running"));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Register user for private messaging
  socket.on("registerUser", ({ username }) => {
    socket.username = username;
    socket.join(`user:${username}`);
  });

  // Join group room
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    console.log(username + " joined " + room);
  });

  // Leave group room
  socket.on("leaveRoom", ({ username, room }) => {
    socket.leave(room);
    console.log(username + " left " + room);
  });

  // Group Message (Room chat)
  socket.on("groupMessage", async ({ room, from_user, message }) => {
    try {
      const newMessage = new GroupMessage({
        from_user,
        room,
        message,
      });

      await newMessage.save();

      io.to(room).emit("groupMessage", {
        from_user,
        message,
        room,
        date_sent: newMessage.date_sent,
      });
    } catch (err) {
      console.error("Error saving message:", err.message);
    }
  });

  // Private Message
  socket.on("privateMessage", async ({ from_user, to_user, message }) => {
    try {
      const newMsg = new PrivateMessage({
        from_user,
        to_user,
        message,
      });

      await newMsg.save();

      // Send to both sender and receiver private rooms
      io.to(`user:${from_user}`).emit("privateMessage", {
        from_user,
        to_user,
        message,
        date_sent: newMsg.date_sent,
      });

      io.to(`user:${to_user}`).emit("privateMessage", {
        from_user,
        to_user,
        message,
        date_sent: newMsg.date_sent,
      });
    } catch (err) {
      console.error("Error saving private message:", err.message);
    }
  });

  // Private Typing Indicator
  socket.on("privateTyping", ({ from_user, to_user, isTyping }) => {
    io.to(`user:${to_user}`).emit("privateTyping", {
      from_user,
      isTyping,
    });
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

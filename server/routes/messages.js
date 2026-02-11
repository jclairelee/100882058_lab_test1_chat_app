const express = require("express");
const router = express.Router();
const GroupMessage = require("../models/GroupMessage");
const PrivateMessage = require("../models/PrivateMessage");

// Get messages for a specific room
router.get("/group/:room", async (req, res) => {
  try {
    const { room } = req.params;

    const messages = await GroupMessage.find({ room }).sort({ _id: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// Get private messages between two users
router.get("/private/:userA/:userB", async (req, res) => {
  try {
    const { userA, userB } = req.params;

    const messages = await PrivateMessage.find({
      $or: [
        { from_user: userA, to_user: userB },
        { from_user: userB, to_user: userA },
      ],
    }).sort({ _id: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching private messages" });
  }
});

module.exports = router;

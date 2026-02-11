const express = require("express");
const router = express.Router();
const GroupMessage = require("../models/GroupMessage");

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

module.exports = router;

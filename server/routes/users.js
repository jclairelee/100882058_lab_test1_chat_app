// Returns user list for private chat dropdown

const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const users = await User.find(
      {},
      { username: 1, firstname: 1, lastname: 1, _id: 0 },
    ).sort({ username: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;

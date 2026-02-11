const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Signup API
router.post("/signup", async (req, res) => {
  try {
    const { username, firstname, lastname, password } = req.body;

    if (!username || !firstname || !lastname || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new User({
      username,
      firstname,
      lastname,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// Login API
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // const config = require('../config/config');
// // const userModel = require('../models/userModel');

// // exports.register = async (req, res) => {
// //   const { username, password, role } = req.body;
// //   if (!config.ROLES.includes(role)) return res.status(400).json({ message: 'Invalid role' });

// //   const hashedPassword = await bcrypt.hash(password, 10);
// //   const { rows } = await userModel.createUser(username, hashedPassword, role);
// //   res.json(rows[0]);
// // };

// // exports.login = async (req, res) => {
// //   const { username, password } = req.body;
// //   const { rows } = await userModel.findUserByUsername(username);
// //   const user = rows[0];

// //   if (!user || !(await bcrypt.compare(password, user.password)))
// //     return res.status(401).json({ message: 'Invalid credentials' });

// //   const token = jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET, { expiresIn: '2h' });
// //   res.json({ token });
// // };

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel"); // Import the User model

// // Register function
// exports.register = async (req, res) => {
//   try {
//     const { username, password, role } = req.body;

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user in the database
//     const newUser = await User.create({
//       username,
//       password: hashedPassword,
//       role,
//     });

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Login function
// exports.login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Find user by username
//     const user = await User.findOne({ where: { username } });

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Compare password with hashed password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import the User model

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!["admin", "loanOfficer", "borrower"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

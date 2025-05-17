// // const pool = require('../config/db');

// // exports.findUserByUsername = (username) =>
// //   pool.query('SELECT * FROM users WHERE username = $1', [username]);

// // exports.createUser = (username, hashedPassword, role) =>
// //   pool.query(
// //     'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
// //     [username, hashedPassword, role]
// //   );

// const pool = require("../config/db");

// // Find user by username
// exports.findUserByUsername = async (username) => {
//   try {
//     const result = await pool.query("SELECT * FROM users WHERE username = $1", [
//       username,
//     ]);
//     return result;
//   } catch (error) {
//     console.error("Error querying database for user:", error);
//     throw error;
//   }
// };

// // Create a new user
// exports.createUser = async (username, hashedPassword, role) => {
//   try {
//     const result = await pool.query(
//       "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
//       [username, hashedPassword, role]
//     );
//     return result;
//   } catch (error) {
//     console.error("Error creating user:", error);
//     throw error; // Re-throw error for handling in the controller
//   }
// };

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "loanOfficer", "borrower"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

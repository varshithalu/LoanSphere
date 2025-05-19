const jwt = require("jsonwebtoken");
const config = require("../config/config");

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Middleware to check if user is admin
exports.authAdmin = (req, res, next) => {
  exports.verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  });
};

// check for admin OR loan_officer
exports.verifyAdminOrOfficer = (req, res, next) => {
  exports.verifyToken(req, res, () => {
    if (req.user.role !== "admin" && req.user.role !== "loan_officer") {
      return res
        .status(403)
        .json({ message: "Access denied: Admins or Loan Officers only" });
    }
    next();
  });
};

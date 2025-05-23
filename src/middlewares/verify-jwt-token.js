const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

const verifyToken = asyncHandler(async (req, res, next) => {
  let token =
    req.cookies["client-pms-token"] ||
    req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No Token Provided." });
  }

  try {
    const secretKey = process.env.JWT_ACCESS_SECRET; // Load secret key from .env
    const decoded = jwt.verify(token, secretKey); // Verify the token

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
});

module.exports = verifyToken;

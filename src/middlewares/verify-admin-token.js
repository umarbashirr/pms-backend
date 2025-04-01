const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

const verifyAdminToken = asyncHandler(async (req, res, next) => {
  let token =
    req.cookies["pms-token"] || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No Token Provided." });
  }

  try {
    const secretKey = process.env.JWT_ADMIN_ACCESS_SECRET; // Load secret key from .env
    const decoded = jwt.verify(token, secretKey); // Verify the token

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
});

module.exports = verifyAdminToken;

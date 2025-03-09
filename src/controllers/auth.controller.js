const asyncHandler = require("express-async-handler");
const { LoginSchema } = require("../schemas/auth.schema");
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const LoginUser = asyncHandler(async (req, res) => {
  const body = req.body;

  const validatedFields = LoginSchema.safeParse(body);

  if (!validatedFields.success) {
    return res.status(400).json({ error: "Invalid input values" });
  }

  const { propertyId, email, password } = validatedFields.data;

  const property = await prisma.property.findUnique({
    where: {
      id: parseInt(propertyId),
    },
  });

  if (!property) {
    return res.status(400).json({ error: "Invalid Property ID" });
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "No record found for this email!" });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return res.status(400).json({ error: "Invalid password!" });
  }

  const userProperty = await prisma.userProperty.findFirst({
    where: {
      userId: user.id,
      propertyId: property.id,
    },
  });

  if (!userProperty) {
    return res
      .status(401)
      .json({ error: "You are not authorized to access this property!" });
  }

  const payload = {
    userId: user.id,
    fullName: user.name,
    email: user.email,
    propertyId: property.id,
    propertyName: property.name,
    propertyEmail: property.email,
    role: userProperty.role,
  };

  const token = await jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1d",
  });

  await res.cookie("pms-token", token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Logged In", token, data: payload });
});

const LogoutUser = asyncHandler(async (req, res) => {
  await res.clearCookie("pms-token");
  return res.status(200).json({ message: "Logged Out" });
});

module.exports = {
  LoginUser,
  LogoutUser,
};

const asyncHandler = require("express-async-handler");
const { PropertyFormSchema } = require("../schemas/property.schema");
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

const BotUser = {
  name: "System Bot",
  email: "info@cooltechdesign.com",
  password: "Umar@1993",
};

const CreateNewProperty = asyncHandler(async (req, res) => {
  const validatedFields = PropertyFormSchema.safeParse(req.body);

  if (!validatedFields.success) {
    return res
      .status(400)
      .json({ error: "Invalid required Input", success: false });
  }

  const property = await prisma.property.create({
    data: {
      ...validatedFields.data,
    },
  });

  if (!property) {
    return res.status(400).json({ error: "Error while creating property" });
  }

  return res.status(201).json({ message: "Property created" });
});

const GetAllProperties = asyncHandler(async (req, res) => {
  const properties = await prisma.property.findMany();

  return res.status(200).json({ properties, message: "Fetched successfully" });
});

const RegisterUserToProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const { name, email, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    create: { name, email, password: hash },
    update: { name, email, password: hash },
  });

  if (!user) {
    return res.status(401).json({ error: "Failed to create or update user!" });
  }

  const userToProperty = await prisma.userProperty.create({
    data: {
      propertyId: parseInt(propertyId),
      userId: user.id,
      role,
    },
  });

  if (!userToProperty) {
    return res
      .status(401)
      .json({ error: "Failed to attached user to the property!" });
  }

  res.status(201).json({ message: "User added to the property." });
});

const GetUsersWithRoleByPropertyId = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const users = await prisma.userProperty
    .findMany({
      where: {
        propertyId: parseInt(propertyId),
      },
      select: {
        role: true,
        userRef: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })
    .then((data) =>
      data
        .map(
          (item) =>
            item.role !== "BOT" && {
              id: item.userRef.id,
              name: item.userRef.name,
              email: item.userRef.email,
              role: item.role,
              createdAt: item.userRef.createdAt,
              updatedAt: item.userRef.updatedAt,
            }
        )
        .filter(Boolean)
    );

  res.status(200).json({ message: "User fetched successfully", users });
});

module.exports = {
  CreateNewProperty,
  GetAllProperties,
  RegisterUserToProperty,
  GetUsersWithRoleByPropertyId,
};

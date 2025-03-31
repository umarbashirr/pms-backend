const asyncHandler = require("express-async-handler");
const { PropertySchema } = require("../schemas/property.schema");
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

const BotUser = {
  name: "System Bot",
  email: "info@cooltechdesign.com",
  password: "Umar@1993",
};

const CreateNewProperty = asyncHandler(async (req, res) => {
  const validatedFields = PropertySchema.safeParse(req.body);

  if (!validatedFields.success) {
    return res
      .status(400)
      .json({ error: "Invalid required Input", success: false });
  }

  const { name, email, secretKey } = validatedFields.data;

  if (secretKey !== process.env.HOTEL_SECRET_KEY) {
    return res.status(400).json({ error: "Invalid Secret Key" });
  }

  const hashedPassword = await bcrypt.hash(BotUser.password, 10);

  const bot = await prisma.user.upsert({
    where: { email: BotUser.email },
    update: {},
    create: {
      name: BotUser.name,
      email: BotUser.email,
      password: hashedPassword,
    },
  });

  const property = await prisma.property.create({
    data: {
      name,
      email,
    },
  });

  if (!property) {
    return res.status(400).json({ error: "Error while creating property" });
  }

  const userHotel = await prisma.userProperty.create({
    data: {
      userId: bot.id,
      propertyId: property.id,
      role: "BOT",
    },
  });

  if (!userHotel) {
    await prisma.property.delete({
      where: {
        id: property.id,
      },
    });

    return res
      .status(400)
      .json({ error: "Error while attaching BOT to New Property" });
  }

  return res.status(201).json({ message: "Property created" });
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
  RegisterUserToProperty,
  GetUsersWithRoleByPropertyId,
};

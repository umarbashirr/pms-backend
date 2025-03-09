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

module.exports = {
  CreateNewProperty,
};

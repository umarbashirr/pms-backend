const asyncHandler = require("express-async-handler");
const { CreateRoomTypeSchema } = require("../schemas/room-type.schema");
const prisma = require("../lib/prisma");

const CreateRoomType = asyncHandler(async (req, res) => {
  const validatedFields = CreateRoomTypeSchema.safeParse(req.body);
  const propertyId = req.params.propertyId;

  if (!validatedFields.success) {
    return res.status(400).json({ error: "Invalid input fields" });
  }

  const { name, code, basePrice, children, adults, maxAllowed, isActive } =
    validatedFields.data;

  const roomType = await prisma.roomType.create({
    data: {
      name,
      code,
      basePrice,
      children,
      adults,
      maxAllowed,
      isActive,
      amenities: [],
      propertyId,
    },
  });

  if (!roomType) {
    return res.status(401).json({ error: "Error while creating room type!" });
  }

  res.status(201).json({ message: "Room type created!", data: roomType });
});

module.exports = {
  CreateRoomType,
};

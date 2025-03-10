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
      propertyId: parseInt(propertyId),
    },
  });

  if (!roomType) {
    return res.status(401).json({ error: "Error while creating room type!" });
  }

  res.status(201).json({ message: "Room type created!", data: roomType });
});

const GetRoomTypesByPropertyId = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  if (!propertyId) {
    return res.status(401).json({ error: "Property ID is missing!" });
  }

  const roomTypes = await prisma.roomType.findMany({
    where: {
      propertyId: parseInt(propertyId),
    },
  });

  res
    .status(200)
    .json({ message: "Room Types fetched successfully!", data: roomTypes });
});

const GetSingleRoomTypeByPropertyId = asyncHandler(async (req, res) => {
  const { propertyId, roomTypeId } = req.params;

  if (!propertyId || !roomTypeId) {
    return res
      .status(401)
      .json({ error: "Either Property ID or Room Type ID is missing!" });
  }

  const roomType = await prisma.roomType.findUnique({
    where: {
      propertyId: parseInt(propertyId),
      id: roomTypeId,
    },
  });

  if (!roomType) {
    return res.status(404).json({ error: "No such room type found!" });
  }

  res
    .status(200)
    .json({ message: "Room Type fetched successfully!", data: roomType });
});

module.exports = {
  CreateRoomType,
  GetRoomTypesByPropertyId,
  GetSingleRoomTypeByPropertyId,
};

const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

const CreateNewRoom = asyncHandler(async (req, res) => {
  const { roomNumber, roomCode, floor } = req.body;
  const { propertyId, roomTypeId } = req.params;

  if (!propertyId || !roomTypeId) {
    return res
      .status(401)
      .json({ error: "Missing Property ID or Room Type ID" });
  }

  const roomType = await prisma.roomType.findFirst({
    where: {
      propertyId: parseInt(propertyId),
    },
  });

  if (!roomType) {
    return res.status(404).json({ error: "No room type found!" });
  }

  const room = await prisma.room.create({
    data: {
      roomNumber,
      roomCode: roomType.code + "_" + roomNumber,
      roomTypeId,
      propertyId: parseInt(propertyId),
      floor,
    },
  });

  if (!room) {
    return res.status(401).json({ error: "Failed to create room" });
  }

  res.status(201).json({ message: "Room Created" });
});

const UpdateRoom = asyncHandler(async (req, res) => {
  const { roomNumber, floor } = req.body;
  const { propertyId, roomTypeId, roomId } = req.params;

  if (!propertyId || !roomTypeId || !roomId) {
    return res
      .status(401)
      .json({ error: "Missing Property ID or Room Type ID or Room ID" });
  }

  const roomType = await prisma.roomType.findFirst({
    where: {
      propertyId: parseInt(propertyId),
    },
  });

  if (!roomType) {
    return res.status(404).json({ error: "No room type found!" });
  }

  const room = await prisma.room.update({
    where: {
      propertyId: parseInt(propertyId),
      roomTypeId,
      id: roomId,
    },
    data: {
      roomNumber,
      roomCode: roomType.code + "_" + roomNumber,
      floor,
    },
  });

  if (!room) {
    return res.status(401).json({ error: "Failed to update room" });
  }

  res.status(201).json({ message: "Room udpated" });
});

const GetAllRoomsByPropertyId = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  if (!propertyId) {
    return res.status(401).json({ error: "Missing Property ID" });
  }

  const roomType = await prisma.roomType.findFirst({
    where: {
      propertyId: parseInt(propertyId),
    },
  });

  if (!roomType) {
    return res.status(404).json({ error: "No room type found!" });
  }

  const rooms = await prisma.room.findMany({
    where: {
      propertyId: parseInt(propertyId),
    },
    include: {
      roomTypeRef: {
        select: {
          id: true,
          name: true,
          code: true,
          basePrice: true,
          children: true,
          adults: true,
          maxAllowed: true,
          isActive: true,
        },
      },
    },
  });

  res.status(200).json({ message: "Rooms fetched", rooms });
});

const GetAllRoomsByPropertyIdAndRoomType = asyncHandler(async (req, res) => {
  const { propertyId, roomTypeId } = req.params;

  if (!propertyId || !roomTypeId) {
    return res
      .status(401)
      .json({ error: "Missing Property ID or Room Type ID" });
  }

  const roomType = await prisma.roomType.findFirst({
    where: {
      propertyId: parseInt(propertyId),
    },
  });

  if (!roomType) {
    return res.status(404).json({ error: "No room type found!" });
  }

  const rooms = await prisma.room.findMany({
    where: {
      propertyId: parseInt(propertyId),
      roomTypeId,
    },
    include: {
      roomTypeRef: {
        select: {
          id: true,
          name: true,
          code: true,
          basePrice: true,
          children: true,
          adults: true,
          maxAllowed: true,
          isActive: true,
        },
      },
    },
  });

  res.status(200).json({ message: "Rooms fetched", rooms });
});

const GetSingleRoomByPropertyIdAndRoomType = asyncHandler(async (req, res) => {
  const { propertyId, roomTypeId, roomId } = req.params;

  if (!propertyId || !roomTypeId || !roomId) {
    return res
      .status(401)
      .json({ error: "Missing Property ID or Room Type ID or Room ID" });
  }

  const roomType = await prisma.roomType.findFirst({
    where: {
      propertyId: parseInt(propertyId),
    },
  });

  if (!roomType) {
    return res.status(404).json({ error: "No room type found!" });
  }

  const room = await prisma.room.findFirst({
    where: {
      propertyId: parseInt(propertyId),
      roomTypeId,
      id: roomId,
    },
    include: {
      roomTypeRef: {
        select: {
          id: true,
          name: true,
          code: true,
          basePrice: true,
          children: true,
          adults: true,
          maxAllowed: true,
          isActive: true,
        },
      },
    },
  });

  res.status(200).json({ message: "Room fetched", room });
});

module.exports = {
  CreateNewRoom,
  UpdateRoom,
  GetAllRoomsByPropertyId,
  GetAllRoomsByPropertyIdAndRoomType,
  GetSingleRoomByPropertyIdAndRoomType,
};

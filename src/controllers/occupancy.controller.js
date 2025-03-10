const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

function getDateRangeArray(startDate, endDate) {
  const dates = [];
  let current = new Date(startDate);

  while (current < endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

const GetRoomAvailability = asyncHandler(async (req, res) => {
  const { checkInDate, checkOutDate } = req.query;

  const { propertyId } = req.params;

  if (!propertyId) {
    return res.status(400).json({ error: "Property ID is missing!" });
  }

  if (!checkInDate || !checkOutDate) {
    return res
      .status(400)
      .json({ error: "Check-In or Check-Out date is missing!" });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkIn > checkOut) {
    return res
      .status(400)
      .json({ error: "Check-In date should be less then check-Out date" });
  }

  const roomCategories = await prisma.roomType.findMany({
    where: {
      propertyId: parseInt(propertyId),
    },
  });

  const dateArray = getDateRangeArray(checkIn, checkOut);

  const availability = await Promise.all(
    roomCategories.map(async (cat) => {
      const totalRooms = await prisma.room.count({
        where: {
          roomTypeId: cat.id,
        },
      });

      return {
        totalRooms,
        roomRef: cat,
      };
    })
  );

  const dateRangeArr = [];

  console.log(dateArray);

  res.status(200).json({ message: "fetched successfully!" });
});

module.exports = {
  GetRoomAvailability,
};

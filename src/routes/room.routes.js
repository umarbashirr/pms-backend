const { Router } = require("express");
const verifyToken = require("../middlewares/verify-jwt-token");
const verifySuperAdminRights = require("../middlewares/verify-super-admin");
const {
  CreateNewRoom,
  GetAllRoomsByPropertyId,
  GetAllRoomsByPropertyIdAndRoomType,
  GetSingleRoomByPropertyIdAndRoomType,
  UpdateRoom,
} = require("../controllers/room.controller");

const router = Router({ mergeParams: true });

router
  .route("/:propertyId/room-types/:roomTypeId/rooms")
  .get(verifyToken, GetAllRoomsByPropertyIdAndRoomType)
  .post(verifyToken, verifySuperAdminRights, CreateNewRoom);

router.route("/:propertyId/rooms").get(verifyToken, GetAllRoomsByPropertyId);

router
  .route("/:propertyId/room-types/:roomTypeId/rooms/:roomId")
  .get(verifyToken, GetSingleRoomByPropertyIdAndRoomType)
  .put(verifyToken, verifySuperAdminRights, UpdateRoom);

module.exports = router;

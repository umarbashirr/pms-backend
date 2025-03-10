const { Router } = require("express");
const {
  CreateRoomType,
  GetRoomTypesByPropertyId,
  GetSingleRoomTypeByPropertyId,
} = require("../controllers/room-type.controller");
const verifyToken = require("../middlewares/verify-jwt-token");
const verifySuperAdminRights = require("../middlewares/verify-super-admin");

const router = Router({ mergeParams: true });

router.route("/").post(verifyToken, verifySuperAdminRights, CreateRoomType);
router.route("/").get(verifyToken, GetRoomTypesByPropertyId);
router.route("/:roomTypeId").get(verifyToken, GetSingleRoomTypeByPropertyId);

module.exports = router;

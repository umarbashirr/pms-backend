const { Router } = require("express");
const { CreateRoomType } = require("../controllers/room-type.controller");
const verifyToken = require("../middlewares/verify-jwt-token");

const router = Router({ mergeParams: true });

router.route("/").post(verifyToken, CreateRoomType);

module.exports = router;

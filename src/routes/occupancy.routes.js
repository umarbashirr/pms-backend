const { Router } = require("express");
const { GetRoomAvailability } = require("../controllers/occupancy.controller");

const router = Router();

router.route("/:propertyId/availability").get(GetRoomAvailability);

module.exports = router;

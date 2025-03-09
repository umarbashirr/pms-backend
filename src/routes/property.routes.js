const { Router } = require("express");
const { CreateNewProperty } = require("../controllers/property.controller");
const router = Router();

router.route("/").post(CreateNewProperty);

module.exports = router;

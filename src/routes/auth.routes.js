const { Router } = require("express");
const { LoginUser, LogoutUser } = require("../controllers/auth.controller");

const router = Router();

router.route("/login").post(LoginUser);
router.route("/logout").post(LogoutUser);

module.exports = router;

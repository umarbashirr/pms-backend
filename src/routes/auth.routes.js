const { Router } = require("express");
const {
  LoginUser,
  LogoutUser,
  getCurrentUser,
  AdminLogin,
} = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verify-jwt-token");

const router = Router();

router.route("/login").post(LoginUser);
router.route("/logout").post(LogoutUser);
router.route("/current-user").get(verifyToken, getCurrentUser);

// Admin Routes
router.route("/admin/login").post(AdminLogin);

module.exports = router;

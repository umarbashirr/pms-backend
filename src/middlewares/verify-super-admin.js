const asyncHandler = require("express-async-handler");

const verifySuperAdminRights = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (user.role !== "BOT" && user.role !== "SUPER_ADMIN") {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this operation!" });
  }

  next();
});

module.exports = verifySuperAdminRights;

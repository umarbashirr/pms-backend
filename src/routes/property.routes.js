const { Router } = require("express");
const {
  CreateNewProperty,
  RegisterUserToProperty,
  GetUsersWithRoleByPropertyId,
  GetAllProperties,
} = require("../controllers/property.controller");
const verifyToken = require("../middlewares/verify-jwt-token");
const verifySuperAdminRights = require("../middlewares/verify-super-admin");
const validateSchema = require("../middlewares/zod-validation");
const { RegisterSchema } = require("../schemas/auth.schema");
const verifyAdminToken = require("../middlewares/verify-admin-token");

const router = Router();

router
  .route("/")
  .post(verifyAdminToken, verifySuperAdminRights, CreateNewProperty)
  .get(verifyAdminToken, verifySuperAdminRights, GetAllProperties);
router
  .route("/:propertyId/users")
  .get(verifyToken, GetUsersWithRoleByPropertyId)
  .post(
    verifyToken,
    verifySuperAdminRights,
    validateSchema(RegisterSchema),
    RegisterUserToProperty
  );

module.exports = router;

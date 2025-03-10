const { Router } = require("express");
const verifyToken = require("../middlewares/verify-jwt-token");
const verifySuperAdminRights = require("../middlewares/verify-super-admin");
const validateSchema = require("../middlewares/zod-validation");
const {
  CreateRatePlan,
  UpdateRatePlan,
  GetAllRatePlans,
} = require("../controllers/rate-plan.controller");
const { RatePlanSchema } = require("../schemas/rate-plan.schema");

const router = Router();

router
  .route("/:propertyId/rate-plan")
  .post(
    verifyToken,
    verifySuperAdminRights,
    validateSchema(RatePlanSchema),
    CreateRatePlan
  )
  .get(verifyToken, GetAllRatePlans);

router
  .route("/:propertyId/rate-plan/:planId")
  .update(
    verifyToken,
    verifySuperAdminRights,
    validateSchema(RatePlanSchema),
    UpdateRatePlan
  );

module.exports = router;

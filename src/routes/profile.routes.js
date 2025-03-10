const { Router } = require("express");
const verifyToken = require("../middlewares/verify-jwt-token");
const validateSchema = require("../middlewares/zod-validation");
const {
  CreateGuestProfile,
  GetGuestProfile,
  UpdateGuestProfile,
  CreateBookerProfile,
  GetBookerProfile,
  UpdateBookerProfile,
} = require("../controllers/profiles.controller");
const {
  CreateGuestProfileSchema,
  CreateBookerProfileSchema,
} = require("../schemas/profile.schema");

const router = Router();

router
  .route("/:propertyId/profiles/guest")
  .post(
    verifyToken,
    validateSchema(CreateGuestProfileSchema),
    CreateGuestProfile
  )
  .get(verifyToken, GetGuestProfile);

router
  .route("/:propertyId/profiles/guest/:profileId")
  .put(
    verifyToken,
    validateSchema(CreateGuestProfileSchema),
    UpdateGuestProfile
  );

// For Booker
router
  .route("/:propertyId/profiles/booker")
  .post(
    verifyToken,
    validateSchema(CreateBookerProfileSchema),
    CreateBookerProfile
  )
  .get(verifyToken, GetBookerProfile);

router
  .route("/:propertyId/profiles/booker/:profileId")
  .put(
    verifyToken,
    validateSchema(CreateBookerProfileSchema),
    UpdateBookerProfile
  );

module.exports = router;

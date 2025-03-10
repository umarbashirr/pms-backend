const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

const CreateGuestProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,

    // Address
    dob,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    pincode,

    // Verification
    idType,
    idNumber,
    placeOfIssue,
    dateOfIssue,
    dateOfExpiry,

    // Other
    isSuspended = false,
    notes,
  } = req.body;

  const user = req.user;
  const { propertyId } = req.params;

  if (!propertyId) {
    return res.status(401).json({ error: "Property ID is required" });
  }

  const existingProfile = await prisma.guestProfile.findFirst({
    where: {
      propertyId: parseInt(propertyId),
      email,
    },
  });

  if (existingProfile) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const profile = await prisma.guestProfile.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNumber,
      dob,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      pincode,
      idType,
      idNumber,
      placeOfIssue,
      dateOfExpiry,
      dateOfIssue,
      notes,
      isSuspended,
      propertyId: parseInt(propertyId),
      createdBy: user.userId,
    },
  });

  if (!profile) {
    return res.status(401).json({ error: "Failed to create guest profile" });
  }

  return res.status(201).json({ message: "Profile created!", data: profile });
});

const UpdateGuestProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,

    // Address
    dob,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    pincode,

    // Verification
    idType,
    idNumber,
    placeOfIssue,
    dateOfIssue,
    dateOfExpiry,

    // Other
    isSuspended = false,
    notes,
  } = req.body;

  const user = req.user;
  const { propertyId, profileId } = req.params;

  if (!propertyId || !profileId) {
    return res
      .status(401)
      .json({ error: "Property & Profile ID are required" });
  }

  const profile = await prisma.guestProfile.update({
    where: {
      id: parseInt(profileId),
      propertyId: parseInt(propertyId),
    },
    data: {
      firstName,
      lastName,
      email,
      phoneNumber,
      dob,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      pincode,
      idType,
      idNumber,
      placeOfIssue,
      dateOfExpiry,
      dateOfIssue,
      notes,
      isSuspended,
      updatedBy: user.userId,
    },
  });

  if (!profile) {
    return res.status(401).json({ error: "Failed to update guest profile" });
  }

  return res.status(200).json({ message: "Profile updated!", data: profile });
});

const GetGuestProfile = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { profileId, email, firstName, lastName, phoneNumber } = req.query;

  if (!propertyId) {
    return res.status(401).json({ error: "Property ID is required" });
  }

  const filters = [];

  if (profileId) filters.push({ id: parseInt(profileId) });
  if (email) filters.push({ email: { equals: email, mode: "insensitive" } });
  if (firstName)
    filters.push({ firstName: { contains: firstName, mode: "insensitive" } });
  if (lastName)
    filters.push({ lastName: { contains: lastName, mode: "insensitive" } });
  if (phoneNumber) filters.push({ phoneNumber });

  if (filters.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one query parameter is required" });
  }

  const profile = await prisma.guestProfile.findMany({
    where: {
      propertyId: parseInt(propertyId),
      AND: filters,
    },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!profile) {
    return res.status(404).json({ error: "Guest profile not found" });
  }

  return res.status(200).json({ message: "Profile fetched!", data: profile });
});

const CreateBookerProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    companyName,
    phoneNumber,
    gstBeneficiary,
    gstNumber,
    gstAddressLine1,
    gstAddressLine2,
    gstState,
    gstPincode,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    pincode,
    isSuspended,
    notes,
    isBTCAllowed,
  } = req.body;

  const user = req.user;
  const { propertyId } = req.params;

  if (!propertyId) {
    return res.status(401).json({ error: "Property ID is required" });
  }

  const existingProfile = await prisma.bookerProfile.findFirst({
    where: {
      propertyId: parseInt(propertyId),
      email,
    },
  });

  if (existingProfile) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const profile = await prisma.bookerProfile.create({
    data: {
      firstName,
      lastName,
      email,
      companyName,
      phoneNumber,
      gstBeneficiary,
      gstNumber,
      gstAddressLine1,
      gstAddressLine2,
      gstState,
      gstPincode,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      pincode,
      isSuspended,
      notes,
      isBTCAllowed,
      propertyId: parseInt(propertyId),
      createdBy: user.userId,
      updatedBy: user.userId,
    },
  });

  if (!profile) {
    return res.status(401).json({ error: "Failed to create booker profile" });
  }

  return res.status(201).json({ message: "Profile created!", data: profile });
});

const UpdateBookerProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    companyName,
    phoneNumber,
    gstBeneficiary,
    gstNumber,
    gstAddressLine1,
    gstAddressLine2,
    gstState,
    gstPincode,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    pincode,
    isSuspended,
    notes,
    isBTCAllowed,
  } = req.body;

  const user = req.user;
  const { propertyId, profileId } = req.params;

  if (!propertyId || !profileId) {
    return res
      .status(401)
      .json({ error: "Property & Profile ID are required" });
  }

  const profile = await prisma.bookerProfile.update({
    where: {
      id: parseInt(profileId),
      propertyId: parseInt(propertyId),
    },
    data: {
      firstName,
      lastName,
      email,
      companyName,
      phoneNumber,
      gstBeneficiary,
      gstNumber,
      gstAddressLine1,
      gstAddressLine2,
      gstState,
      gstPincode,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      pincode,
      isSuspended,
      notes,
      isBTCAllowed,
      updatedBy: user.userId,
    },
  });

  if (!profile) {
    return res.status(401).json({ error: "Failed to update booker profile" });
  }

  return res.status(200).json({ message: "Profile updated!", data: profile });
});

const GetBookerProfile = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { profileId, email, firstName, lastName, phoneNumber, companyName } =
    req.query;

  if (!propertyId) {
    return res.status(401).json({ error: "Property ID is required" });
  }

  const filters = [];

  if (profileId) filters.push({ id: parseInt(profileId) });
  if (email) filters.push({ email: { equals: email, mode: "insensitive" } });
  if (firstName)
    filters.push({ firstName: { contains: firstName, mode: "insensitive" } });
  if (lastName)
    filters.push({ lastName: { contains: lastName, mode: "insensitive" } });
  filters.push({
    companyName: { contains: companyName, mode: "insensitive" },
  });
  if (phoneNumber) filters.push({ phoneNumber });

  if (filters.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one query parameter is required" });
  }

  const profile = await prisma.bookerProfile.findMany({
    where: {
      propertyId: parseInt(propertyId),
      AND: filters,
    },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!profile) {
    return res.status(404).json({ error: "Booker profile not found" });
  }

  return res.status(200).json({ message: "Profile fetched!", data: profile });
});

module.exports = {
  CreateGuestProfile,
  UpdateGuestProfile,
  GetGuestProfile,
  CreateBookerProfile,
  UpdateBookerProfile,
  GetBookerProfile,
};

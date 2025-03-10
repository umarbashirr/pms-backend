const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

const CreateRatePlan = asyncHandler(async (req, res) => {
  const { name, code, rate, tax } = req.body;

  const { propertyId } = req.params;
  const user = req.user;

  if (!propertyId) {
    return res.status(400).json({ error: "Property ID is missing" });
  }

  const plan = await prisma.ratePlan.create({
    data: {
      name,
      code,
      rate,
      tax,
      totalAmount: rate + tax,
      propertyRef: parseInt(propertyId),
      updatedBy: user.userId,
    },
  });

  if (!plan) {
    return res.status(400).json({ error: "Failed to create rate plan" });
  }

  res.status(201).json({ message: "Plan created", data: plan });
});

const UpdateRatePlan = asyncHandler(async (req, res) => {
  const { name, code, rate, tax } = req.body;

  const { propertyId, planId } = req.params;
  const user = req.user;

  if (!propertyId || !planId) {
    return res.status(400).json({ error: "Missing Property or Plan ID" });
  }

  const plan = await prisma.ratePlan.update({
    where: {
      id: planId,
      propertyId: parseInt(propertyId),
    },
    data: {
      name,
      code,
      rate,
      tax,
      totalAmount: rate + tax,
      updatedBy: user.userId,
    },
  });

  if (!plan) {
    return res.status(400).json({ error: "Failed to update rate plan" });
  }

  res.status(200).json({ message: "Plan updated", data: plan });
});

const GetAllRatePlans = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  if (!propertyId) {
    return res.status(400).json({ error: "Property ID is missing" });
  }

  const plans = await prisma.ratePlan.findMany({
    where: {
      propertyId: parseInt(propertyId),
    },
  });

  res.status(200).json({ message: "Plan fetched", data: plans });
});

module.exports = { CreateRatePlan, UpdateRatePlan, GetAllRatePlans };

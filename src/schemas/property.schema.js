const { z } = require("zod");

const PropertySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Property name should be minimum 02 characters." }),
  email: z.string().email({
    message: "Please provide a valid email",
  }),
  secretKey: z.string({
    message: "Secret key is required",
  }),
});

const PropertyFormSchema = z.object({
  propertyCode: z
    .string({ message: "Property code is required!" })
    .min(2, { message: "Should be minimum 02 characters" }),
  name: z
    .string({ message: "Name is required" })
    .min(2, { message: "Name should be minimum 02 characters" }),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Please provide valid email" }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  website: z.string().optional(),
  mapURL: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  currency: z.string().optional(),
  GSTIN: z.string().optional(),
  beneficiaryName: z.string().optional(),
  gstAddress1: z.string().optional(),
  gstAddress2: z.string().optional(),
  gstState: z.string().optional(),
  gstPincode: z.string().optional(),
  isActive: z.coerce.boolean().default(true),
  isLaunched: z.coerce.boolean().default(false),
  isMembershipExpired: z.coerce.boolean().default(false),
  membershipExpireDate: z.string().optional(),
});

module.exports = {
  PropertySchema,
  PropertyFormSchema,
};

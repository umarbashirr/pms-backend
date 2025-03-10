const z = require("zod");

const CreateGuestProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().optional(),

  // Address Fields
  dob: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  pincode: z.string().optional(),

  // Verification Fields
  idType: z
    .enum(["PASSPORT", "ADHAAR", "DRIVING_LICENSE", "VORTER_CARD", "OTHER"])
    .nullable()
    .optional(),
  idNumber: z.string().optional(),
  placeOfIssue: z.string().optional(),
  dateOfIssue: z.string().optional(),
  dateOfExpiry: z.string().optional(),

  // Other Fields
  isSuspended: z.boolean().default(false),
  notes: z.string().optional(),
});

const CreateBookerProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),

  companyName: z.string().optional(),
  phoneNumber: z.string().optional(),

  // GST Details
  gstBeneficiary: z.string().optional(),
  gstNumber: z.string().optional(),
  gstAddressLine1: z.string().optional(),
  gstAddressLine2: z.string().optional(),
  gstState: z.string().optional(),
  gstPincode: z.string().optional(),

  // Address
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),

  // Other
  isSuspended: z.boolean().default(false),
  notes: z.string().optional(),
  isBTCAllowed: z.boolean().default(false),

  // Tracking Information
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

module.exports = {
  CreateGuestProfileSchema,
  CreateBookerProfileSchema,
};

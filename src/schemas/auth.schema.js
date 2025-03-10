const z = require("zod");

const LoginSchema = z.object({
  propertyId: z.coerce.number({
    message: "Property ID is required",
  }),
  email: z.string().email({
    message: "Please enter a valid email!",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password should be minimum 08 characters!",
    })
    .max(20, {
      message: "Password should be maximum 20 characters!",
    }),
});

const RegisterSchema = z.object({
  name: z.string({
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Please enter a valid email!",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password should be minimum 08 characters!",
    })
    .max(20, {
      message: "Password should be maximum 20 characters!",
    }),
  role: z
    .enum([
      "FRONT_OFFICE",
      "RESERVATION",
      "HOTEL_MANAGER",
      "FINANCE",
      "BOT",
      "ADMIN",
      "SUPER_ADMIN",
      "HOUSE_KEEPING",
      "RESTAURANT",
    ])
    .default("FRONT_OFFICE"),
});

module.exports = {
  LoginSchema,
  RegisterSchema,
};

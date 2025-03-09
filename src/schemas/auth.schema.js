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

module.exports = {
  LoginSchema,
};

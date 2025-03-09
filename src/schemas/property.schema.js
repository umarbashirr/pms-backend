const z = require("zod");

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

module.exports = {
  PropertySchema,
};

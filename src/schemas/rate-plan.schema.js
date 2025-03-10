const z = require("zod");

const RatePlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  rate: z.coerce.number().nonnegative(),
  tax: z.coerce.number().nonnegative(),
  totalAmount: z.coerce.number().nonnegative(),
});

module.exports = {
  RatePlanSchema,
};

const z = require("zod");

const CreateRoomTypeSchema = z.object({
  name: z.string(),
  code: z.string(),
  basePrice: z.coerce.number(),
  children: z.coerce.number(),
  adults: z.coerce.number(),
  maxAllowed: z.coerce.number(),
  isActive: z.coerce.boolean(),
});

module.exports = {
  CreateRoomTypeSchema,
};

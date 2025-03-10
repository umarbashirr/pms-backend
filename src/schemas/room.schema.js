const z = require("zod");

const CreateRoomSchema = z.object({
  roomNumber: z.string({
    message: "Room Number is required",
  }),
  floor: z.coerce.number({
    message: "Floor number is required",
  }),
});

module.exports = {
  CreateRoomSchema,
};

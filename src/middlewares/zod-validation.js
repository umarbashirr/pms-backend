const { z } = require("zod");

const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Validate request body
    next(); // Proceed if valid
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }))[0].message,
      });
    }
    next(error); // Pass unexpected errors to the error handler
  }
};

module.exports = validateSchema;

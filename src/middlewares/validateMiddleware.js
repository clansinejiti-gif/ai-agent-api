export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: (error.errors || error.issues || []).map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }
};

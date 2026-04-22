export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  if (error?.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
    const prettyField = duplicateField === "userId" ? "username or email" : duplicateField;

    return res.status(409).json({
      message: `${prettyField} already exists`,
    });
  }

  const status = error.status || 500;
  res.status(status).json({
    message: error.message || "Something went wrong",
  });
};

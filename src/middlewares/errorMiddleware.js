const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || res.statusCode;
  let message = error.message || "Something went wrong";
  let errors;

  if (!statusCode || statusCode === 200) {
    statusCode = 500;
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(error.errors).map((item) => item.message);
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = `${Object.keys(error.keyValue)[0]} already exists`;
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {})
  });
};

module.exports = {
  notFound,
  errorHandler
};

 
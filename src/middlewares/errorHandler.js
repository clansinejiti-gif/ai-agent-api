export default function errorHandler(req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Somthing went wrong on the server",
  });
}

import * as Sentry from "@sentry/node";

const errorHandler = (err, req, res, next) => {
  Sentry.captureException(err);
  if (typeof err.message !== "undefined") {
    let status = 500;
    if (err.name === "ValidationError") {
      status = 400;
    } else if (err.code === 11000) {
      status = 409;
    }
    return res.status(status).json({ message: err.message });
  }
  next();
};

export default errorHandler;

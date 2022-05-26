const { ResourceNotFoundError } = require('./utils');

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable-next-line no-unused-vars */
function errorHandler(err, req, res, next) {
  if (err instanceof ResourceNotFoundError) {
    res.status(404);
  } else if (err.name === 'SequelizeValidationError') {
    res.status(400);
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    err.message = err.errors.map((ve) => ve.message).join('\n');
    res.status(400);
  } else if (res.status === 200) {
    res.status(500);
  }

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  });
}

module.exports = {
  notFound,
  errorHandler,
};

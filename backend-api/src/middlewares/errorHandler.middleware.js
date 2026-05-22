function errorHandler(error, req, res, next) {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: true,
      message: error.errors?.[0]?.message || 'Registro duplicado.'
    });
  }

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeDatabaseError'
  ) {
    return res.status(400).json({
      error: true,
      message: error.errors?.[0]?.message || error.message || 'Datos invalidos.'
    });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    error: true,
    message: error.message || 'Error interno del servidor.'
  });
}

module.exports = errorHandler;

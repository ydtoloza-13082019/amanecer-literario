const ApiError = require('../utils/ApiError');

function validateRequiredFields(fields) {
  return (req, res, next) => {
    const faltantes = fields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (faltantes.length > 0) {
      return next(
        new ApiError(
          `Faltan campos requeridos: ${faltantes.join(', ')}.`,
          400
        )
      );
    }

    return next();
  };
}

module.exports = validateRequiredFields;


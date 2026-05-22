const ApiError = require('../utils/ApiError');

function validateIdParam(paramName = 'id') {
  return (req, res, next) => {
    const value = Number(req.params[paramName]);

    if (!Number.isInteger(value) || value <= 0) {
      return next(
        new ApiError(
          `El parametro ${paramName} debe ser un entero positivo.`,
          400
        )
      );
    }

    return next();
  };
}

module.exports = validateIdParam;


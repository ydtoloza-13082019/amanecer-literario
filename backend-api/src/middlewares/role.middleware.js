const ApiError = require('../utils/ApiError');

const ROLES_VALIDOS = ['admin', 'cliente'];

function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Usuario no autenticado.', 401));
    }

    const rol = req.user.rol;

    if (!ROLES_VALIDOS.includes(rol)) {
      return next(new ApiError('Rol no valido.', 403));
    }

    if (!rolesPermitidos.includes(rol)) {
      return next(
        new ApiError('No tienes permisos para realizar esta accion.', 403)
      );
    }
    return next();
  };
}

module.exports = verificarRol;

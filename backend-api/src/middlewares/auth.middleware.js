const ApiError = require('../utils/ApiError');
const { verificarToken } = require('../utils/jwt');

function autenticarToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ApiError('Token no proporcionado.', 401));
  }

  const token = authorization.split(' ')[1];

  try {
    const payload = verificarToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol
    };

    return next();
  } catch (error) {
    return next(new ApiError('Token invalido o expirado.', 401));
  }
}

module.exports = autenticarToken;


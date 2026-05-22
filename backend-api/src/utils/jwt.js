const jwt = require('jsonwebtoken');

function generarToken(usuario) {
  return jwt.sign(
    {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    process.env.JWT_SECRET || 'super_secreto_jwt_cambiar_en_produccion',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    }
  );
}

function verificarToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'super_secreto_jwt_cambiar_en_produccion'
  );
}

module.exports = {
  generarToken,
  verificarToken
};


const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const sanitizeUser = require('../utils/sanitizeUser');
const { generarToken } = require('../utils/jwt');

class AuthService {
  constructor(usuarioRepository, usuarioService) {
    this.usuarioRepository = usuarioRepository;
    this.usuarioService = usuarioService;
  }

  async registrar(data) {
    try {
      const usuario = await this.usuarioService.crearUsuario(data, null);
      const usuarioCreado = await this.usuarioRepository.findByEmail(data.email);
      const token = generarToken(usuarioCreado);

      return {
        message: 'Usuario registrado correctamente.',
        token,
        usuario
      };
    } catch (error) {
      throw error;
    }
  }

  async login(data) {
    try {
      const usuario = await this.usuarioRepository.findByEmail(data.email);

      if (!usuario) {
        throw new ApiError('Credenciales invalidas.', 401);
      }

      if (!usuario.activo) {
        throw new ApiError('El usuario esta inactivo.', 403);
      }

      const passwordValido = await bcrypt.compare(data.password, usuario.password);

      if (!passwordValido) {
        throw new ApiError('Credenciales invalidas.', 401);
      }

      return {
        message: 'Login exitoso.',
        token: generarToken(usuario),
        usuario: sanitizeUser(usuario)
      };
    } catch (error) {
      throw error;
    }
  }

  async perfil(userId) {
    try {
      return await this.usuarioService.obtenerUsuarioSanitizadoPorId(userId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;


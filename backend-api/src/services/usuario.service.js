const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const sanitizeUser = require('../utils/sanitizeUser');

class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async crearUsuario(data, actor = null) {
    try {
      const existente = await this.usuarioRepository.findByEmail(data.email);

      if (existente) {
        throw new ApiError('Ya existe un usuario con ese email.', 409);
      }

      const totalUsuarios = await this.usuarioRepository.countAll();
      let rol = data.rol || 'cliente';

      if (!actor) {
        rol = totalUsuarios === 0 ? 'admin' : 'cliente';
      } else if (actor.rol !== 'admin') {
        throw new ApiError('No tienes permisos para crear usuarios.', 403);
      }

      const passwordHash = await bcrypt.hash(data.password, 10);

      const usuario = await this.usuarioRepository.create({
        nombre: data.nombre,
        email: data.email,
        password: passwordHash,
        rol,
        activo: data.activo ?? true
      });

      return sanitizeUser(usuario);
    } catch (error) {
      throw error;
    }
  }

  async obtenerUsuarios() {
    try {
      const usuarios = await this.usuarioRepository.findAll();
      return usuarios.map((usuario) => sanitizeUser(usuario));
    } catch (error) {
      throw error;
    }
  }

  async obtenerUsuarioPorId(id) {
    try {
      const usuario = await this.usuarioRepository.findById(id);

      if (!usuario) {
        throw new ApiError('Usuario no encontrado.', 404);
      }

      return usuario;
    } catch (error) {
      throw error;
    }
  }

  async obtenerUsuarioSanitizadoPorId(id) {
    try {
      const usuario = await this.obtenerUsuarioPorId(id);
      return sanitizeUser(usuario);
    } catch (error) {
      throw error;
    }
  }

  async actualizarUsuario(id, data, actor) {
    try {
      const usuario = await this.obtenerUsuarioPorId(id);

      if (actor.rol !== 'admin' && actor.id !== usuario.id) {
        throw new ApiError('No tienes permisos para actualizar este usuario.', 403);
      }

      if (data.email && data.email !== usuario.email) {
        const existente = await this.usuarioRepository.findByEmail(data.email);

        if (existente && existente.id !== usuario.id) {
          throw new ApiError('Ya existe un usuario con ese email.', 409);
        }
      }

      const payload = {
        nombre: data.nombre ?? usuario.nombre,
        email: data.email ?? usuario.email,
        activo: data.activo ?? usuario.activo
      };

      if (actor.rol === 'admin' && data.rol) {
        payload.rol = data.rol;
      }

      if (data.password) {
        payload.password = await bcrypt.hash(data.password, 10);
      }

      const actualizado = await this.usuarioRepository.update(usuario, payload);
      return sanitizeUser(actualizado);
    } catch (error) {
      throw error;
    }
  }

  async eliminarUsuario(id, actor) {
    try {
      const usuario = await this.obtenerUsuarioPorId(id);

      if (actor.rol !== 'admin') {
        throw new ApiError('No tienes permisos para eliminar usuarios.', 403);
      }

      if (actor.id === usuario.id) {
        throw new ApiError('No puedes eliminar tu propio usuario.', 400);
      }

      await this.usuarioRepository.delete(usuario);
      return { message: 'Usuario eliminado correctamente.' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UsuarioService;


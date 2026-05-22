class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  async index(req, res, next) {
    try {
      const usuarios = await this.usuarioService.obtenerUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const usuario = await this.usuarioService.obtenerUsuarioSanitizadoPorId(
        Number(req.params.id)
      );
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const usuario = await this.usuarioService.crearUsuario(req.body, req.user);
      res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const usuario = await this.usuarioService.actualizarUsuario(
        Number(req.params.id),
        req.body,
        req.user
      );
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      const respuesta = await this.usuarioService.eliminarUsuario(
        Number(req.params.id),
        req.user
      );
      res.status(200).json(respuesta);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsuarioController;


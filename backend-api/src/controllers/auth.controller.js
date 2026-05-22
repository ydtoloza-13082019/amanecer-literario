class AuthController {
  constructor(authService) {
    this.authService = authService;
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.me = this.me.bind(this);
  }

  async register(req, res, next) {
    try {
      const respuesta = await this.authService.registrar(req.body);
      res.status(201).json(respuesta);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const respuesta = await this.authService.login(req.body);
      res.status(200).json(respuesta);
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const usuario = await this.authService.perfil(req.user.id);
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;


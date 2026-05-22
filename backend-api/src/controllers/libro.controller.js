class LibroController {
  constructor(libroService) {
    this.libroService = libroService;
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  async index(req, res, next) {
    try {
      const libros = await this.libroService.obtenerLibros(req.query);
      res.status(200).json(libros);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const libro = await this.libroService.obtenerLibroPorId(
        Number(req.params.id)
      );
      res.status(200).json(libro);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const libro = await this.libroService.crearLibro(req.body);
      res.status(201).json(libro);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const libro = await this.libroService.actualizarLibro(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(libro);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      const respuesta = await this.libroService.eliminarLibro(
        Number(req.params.id)
      );
      res.status(200).json(respuesta);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LibroController;

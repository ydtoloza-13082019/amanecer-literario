class CategoriaController {
  constructor(categoriaService) {
    this.categoriaService = categoriaService;
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  async index(req, res, next) {
    try {
      const categorias = await this.categoriaService.obtenerCategorias(req.query);
      res.status(200).json(categorias);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const categoria = await this.categoriaService.obtenerCategoriaPorId(
        Number(req.params.id)
      );
      res.status(200).json(categoria);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const categoria = await this.categoriaService.crearCategoria(req.body);
      res.status(201).json(categoria);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const categoria = await this.categoriaService.actualizarCategoria(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(categoria);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      const respuesta = await this.categoriaService.eliminarCategoria(
        Number(req.params.id)
      );
      res.status(200).json(respuesta);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoriaController;

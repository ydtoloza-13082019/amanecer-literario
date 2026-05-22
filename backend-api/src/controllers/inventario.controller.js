class InventarioController {
  constructor(inventarioService) {
    this.inventarioService = inventarioService;
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.disponibilidadPorLibro = this.disponibilidadPorLibro.bind(this);
  }

  async index(req, res, next) {
    try {
      const inventarios = await this.inventarioService.obtenerInventarios(req.query);
      res.status(200).json(inventarios);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const inventario = await this.inventarioService.obtenerInventarioPorId(
        Number(req.params.id)
      );
      res.status(200).json(inventario);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const inventario = await this.inventarioService.crearInventario(req.body);
      res.status(201).json(inventario);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const inventario = await this.inventarioService.actualizarInventario(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(inventario);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      const respuesta = await this.inventarioService.eliminarInventario(
        Number(req.params.id)
      );
      res.status(200).json(respuesta);
    } catch (error) {
      next(error);
    }
  }

  async disponibilidadPorLibro(req, res, next) {
    try {
      const disponibilidad =
        await this.inventarioService.obtenerDisponibilidadPorLibro(
          Number(req.params.libroId)
        );

      res.status(200).json(disponibilidad);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InventarioController;

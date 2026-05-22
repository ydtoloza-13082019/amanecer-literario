class CarritoController {
  constructor(carritoService) {
    this.carritoService = carritoService;
    this.show = this.show.bind(this);
    this.agregar = this.agregar.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.confirmar = this.confirmar.bind(this);
  }

  async show(req, res, next) {
    try {
      const carrito = await this.carritoService.obtenerCarritoActual(req.user.id);
      res.status(200).json(carrito);
    } catch (error) {
      next(error);
    }
  }

  async agregar(req, res, next) {
    try {
      const carrito = await this.carritoService.agregarLibro(req.user.id, req.body);
      res.status(200).json(carrito);
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const carrito = await this.carritoService.actualizarItem(
        req.user.id,
        Number(req.params.id),
        req.body
      );
      res.status(200).json(carrito);
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const carrito = await this.carritoService.eliminarItem(
        req.user.id,
        Number(req.params.id)
      );
      res.status(200).json(carrito);
    } catch (error) {
      next(error);
    }
  }

  async confirmar(req, res, next) {
    try {
      const pedido = await this.carritoService.confirmarCompra(req.user.id);
      res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CarritoController;


class PedidoController {
  constructor(pedidoService) {
    this.pedidoService = pedidoService;
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  async index(req, res, next) {
    try {
      const pedidos = await this.pedidoService.obtenerPedidos(req.user, req.query);
      res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const pedido = await this.pedidoService.obtenerPedidoPorId(
        Number(req.params.id),
        req.user
      );
      res.status(200).json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const pedido = await this.pedidoService.cancelarPedido(
        Number(req.params.id),
        req.user
      );
      res.status(200).json(pedido);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PedidoController;

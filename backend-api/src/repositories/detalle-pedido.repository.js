class DetallePedidoRepository {
  constructor(DetallePedidoModel) {
    this.DetallePedido = DetallePedidoModel;
  }

  async bulkCreate(data, transaction = null) {
    return this.DetallePedido.bulkCreate(data, { transaction });
  }
}

module.exports = DetallePedidoRepository;


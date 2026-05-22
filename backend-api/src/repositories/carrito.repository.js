class CarritoRepository {
  constructor(CarritoModel, CarritoItemModel, LibroModel) {
    this.Carrito = CarritoModel;
    this.CarritoItem = CarritoItemModel;
    this.Libro = LibroModel;
  }

  async findActiveByUsuarioId(usuarioId, transaction = null, lock = false) {
    return this.Carrito.findOne({
      where: {
        usuario_id: usuarioId,
        activo: true
      },
      include: [
        {
          model: this.CarritoItem,
          as: 'items',
          required: false,
          include: [
            {
              model: this.Libro,
              as: 'libro'
            }
          ]
        }
      ],
      order: [[{ model: this.CarritoItem, as: 'items' }, 'id', 'ASC']],
      transaction,
      lock
    });
  }

  async findActiveManyByUsuarioId(usuarioId, transaction = null) {
    return this.Carrito.findAll({
      where: {
        usuario_id: usuarioId,
        activo: true
      },
      order: [['id', 'ASC']],
      transaction
    });
  }

  async create(data, transaction = null) {
    return this.Carrito.create(data, { transaction });
  }

  async update(carrito, data, transaction = null) {
    return carrito.update(data, { transaction });
  }
}

module.exports = CarritoRepository;


class CarritoItemRepository {
  constructor(CarritoItemModel, LibroModel) {
    this.CarritoItem = CarritoItemModel;
    this.Libro = LibroModel;
  }

  async findById(id, transaction = null) {
    return this.CarritoItem.findByPk(id, {
      include: [
        {
          model: this.Libro,
          as: 'libro'
        }
      ],
      transaction
    });
  }

  async findByCarritoAndLibro(carritoId, libroId, transaction = null) {
    return this.CarritoItem.findOne({
      where: {
        carrito_id: carritoId,
        libro_id: libroId
      },
      include: [
        {
          model: this.Libro,
          as: 'libro'
        }
      ],
      transaction
    });
  }

  async create(data, transaction = null) {
    return this.CarritoItem.create(data, { transaction });
  }

  async update(item, data, transaction = null) {
    return item.update(data, { transaction });
  }

  async delete(item, transaction = null) {
    return item.destroy({ transaction });
  }
}

module.exports = CarritoItemRepository;


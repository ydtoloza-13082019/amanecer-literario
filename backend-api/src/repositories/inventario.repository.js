const { Op } = require('sequelize');

class InventarioRepository {
  constructor(InventarioModel, LibroModel, FeriaModel) {
    this.Inventario = InventarioModel;
    this.Libro = LibroModel;
    this.Feria = FeriaModel;
  }

  async create(data) {
    return this.Inventario.create(data);
  }

  async findAll(options = {}) {
    const { limit, offset, ubicacionTipo, libroId, onlyAvailable } = options;
    const where = {};

    if (ubicacionTipo) {
      where.ubicacion_tipo = ubicacionTipo;
    }

    if (libroId) {
      where.libro_id = libroId;
    }

    if (onlyAvailable) {
      where.stock = { [Op.gt]: 0 };
    }

    return this.Inventario.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: this.Libro,
          as: 'libro'
        },
        {
          model: this.Feria,
          as: 'feria',
          required: false
        }
      ],
      distinct: true,
      order: [['id', 'ASC']]
    });
  }

  async findById(id) {
    return this.Inventario.findByPk(id, {
      include: [
        {
          model: this.Libro,
          as: 'libro'
        },
        {
          model: this.Feria,
          as: 'feria',
          required: false
        }
      ]
    });
  }

  async findByLibroId(libroId, onlyAvailable = false) {
    const where = { libro_id: libroId };

    if (onlyAvailable) {
      where.stock = { [Op.gt]: 0 };
    }

    return this.Inventario.findAll({
      where,
      include: [
        {
          model: this.Libro,
          as: 'libro'
        },
        {
          model: this.Feria,
          as: 'feria',
          required: false
        }
      ],
      order: [['stock', 'DESC']]
    });
  }

  async findOneByLibroAndUbicacion(libroId, ubicacionTipo, ubicacionId) {
    return this.Inventario.findOne({
      where: {
        libro_id: libroId,
        ubicacion_tipo: ubicacionTipo,
        ubicacion_id: ubicacionId
      }
    });
  }

  async update(inventario, data) {
    return inventario.update(data);
  }

  async delete(inventario) {
    return inventario.destroy();
  }
}

module.exports = InventarioRepository;

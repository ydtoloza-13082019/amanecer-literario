const { Op } = require('sequelize');

class LibroRepository {
  constructor(LibroModel, CategoriaModel, InventarioModel, FeriaModel) {
    this.Libro = LibroModel;
    this.Categoria = CategoriaModel;
    this.Inventario = InventarioModel;
    this.Feria = FeriaModel;
  }

  async create(data) {
    return this.Libro.create(data);
  }

  async findAll(options = {}) {
    const { limit, offset, search, categoriaId, activo } = options;
    const where = {};

    if (search) {
      where[Op.or] = [
        { titulo: { [Op.like]: `%${search}%` } },
        { autor: { [Op.like]: `%${search}%` } },
        { isbn: { [Op.like]: `%${search}%` } }
      ];
    }

    if (categoriaId) {
      where.categoria_id = categoriaId;
    }

    if (activo !== undefined) {
      where.activo = activo;
    }

    return this.Libro.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: this.Categoria,
          as: 'categoria'
        }
      ],
      distinct: true,
      order: [['id', 'ASC']]
    });
  }

  async findById(id) {
    return this.Libro.findByPk(id, {
      include: [
        {
          model: this.Categoria,
          as: 'categoria'
        },
        {
          model: this.Inventario,
          as: 'inventarios',
          required: false,
          include: [
            {
              model: this.Feria,
              as: 'feria',
              required: false
            }
          ]
        }
      ]
    });
  }

  async update(libro, data) {
    return libro.update(data);
  }

  async delete(libro) {
    return libro.destroy();
  }
}

module.exports = LibroRepository;

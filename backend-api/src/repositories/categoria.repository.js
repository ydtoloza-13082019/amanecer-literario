const { Op } = require('sequelize');

class CategoriaRepository {
  constructor(CategoriaModel) {
    this.Categoria = CategoriaModel;
  }

  async create(data) {
    return this.Categoria.create(data);
  }

  async findAll(options = {}) {
    const { limit, offset, search } = options;
    const where = {};

    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } }
      ];
    }

    return this.Categoria.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']]
    });
  }

  async findById(id) {
    return this.Categoria.findByPk(id);
  }

  async update(categoria, data) {
    return categoria.update(data);
  }

  async delete(categoria) {
    return categoria.destroy();
  }
}

module.exports = CategoriaRepository;

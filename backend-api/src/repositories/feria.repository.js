const { Op } = require('sequelize');

class FeriaRepository {
  constructor(FeriaModel) {
    this.Feria = FeriaModel;
  }

  async create(data) {
    return this.Feria.create(data);
  }

  async findAll(options = {}) {
    const { limit, offset, search, activa } = options;
    const where = {};

    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { ciudad: { [Op.like]: `%${search}%` } },
        { direccion: { [Op.like]: `%${search}%` } }
      ];
    }

    if (activa !== undefined) {
      where.activa = activa;
    }

    return this.Feria.findAndCountAll({
      where,
      limit,
      offset,
      order: [['fecha_inicio', 'ASC']]
    });
  }

  async findById(id) {
    return this.Feria.findByPk(id);
  }

  async update(feria, data) {
    return feria.update(data);
  }

  async delete(feria) {
    return feria.destroy();
  }
}

module.exports = FeriaRepository;

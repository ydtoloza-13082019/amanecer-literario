class UsuarioRepository {
  constructor(UsuarioModel) {
    this.Usuario = UsuarioModel;
  }

  async countAll() {
    return this.Usuario.count();
  }

  async create(data) {
    return this.Usuario.create(data);
  }

  async findAll() {
    return this.Usuario.findAll({
      order: [['id', 'ASC']]
    });
  }

  async findById(id) {
    return this.Usuario.findByPk(id);
  }

  async findByEmail(email) {
    return this.Usuario.findOne({
      where: { email }
    });
  }

  async update(usuario, data) {
    return usuario.update(data);
  }

  async delete(usuario) {
    return usuario.destroy();
  }
}

module.exports = UsuarioRepository;


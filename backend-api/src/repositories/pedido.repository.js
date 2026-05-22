const { Op } = require('sequelize');

class PedidoRepository {
  constructor(PedidoModel, DetallePedidoModel, LibroModel, UsuarioModel) {
    this.Pedido = PedidoModel;
    this.DetallePedido = DetallePedidoModel;
    this.Libro = LibroModel;
    this.Usuario = UsuarioModel;
  }

  async create(data, transaction = null) {
    return this.Pedido.create(data, { transaction });
  }

  async findAll(options = {}, transaction = null) {
    const { limit, offset, estado, usuarioId, from, to } = options;
    const where = {};

    if (estado) {
      where.estado = estado;
    }

    if (usuarioId) {
      where.usuario_id = usuarioId;
    }

    if (from || to) {
      where.createdAt = {};
      if (from) {
        where.createdAt[Op.gte] = new Date(from);
      }
      if (to) {
        where.createdAt[Op.lte] = new Date(to);
      }
    }

    return this.Pedido.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: this.Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email', 'rol']
        },
        {
          model: this.DetallePedido,
          as: 'detalles',
          include: [
            {
              model: this.Libro,
              as: 'libro'
            }
          ]
        }
      ],
      distinct: true,
      order: [['id', 'DESC']],
      transaction
    });
  }

  async findAllByUsuarioId(usuarioId, options = {}, transaction = null) {
    const { limit, offset, estado, from, to } = options;
    const where = { usuario_id: usuarioId };

    if (estado) {
      where.estado = estado;
    }

    if (from || to) {
      where.createdAt = {};
      if (from) {
        where.createdAt[Op.gte] = new Date(from);
      }
      if (to) {
        where.createdAt[Op.lte] = new Date(to);
      }
    }

    return this.Pedido.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: this.DetallePedido,
          as: 'detalles',
          include: [
            {
              model: this.Libro,
              as: 'libro'
            }
          ]
        }
      ],
      distinct: true,
      order: [['id', 'DESC']],
      transaction
    });
  }

  async findById(id, transaction = null) {
    return this.Pedido.findByPk(id, {
      include: [
        {
          model: this.Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email', 'rol']
        },
        {
          model: this.DetallePedido,
          as: 'detalles',
          include: [
            {
              model: this.Libro,
              as: 'libro'
            }
          ]
        }
      ],
      transaction
    });
  }

  async update(pedido, data, transaction = null) {
    return pedido.update(data, { transaction });
  }
}

module.exports = PedidoRepository;

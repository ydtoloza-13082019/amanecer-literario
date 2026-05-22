const ApiError = require('../utils/ApiError');
const { parsePagination, buildPaginationMeta } = require('../utils/query');
const { sanitizePedido } = require('../utils/sanitizeDomain');

class PedidoService {
  constructor(pedidoRepository, inventarioRepository, sequelize, inventarioModel) {
    this.pedidoRepository = pedidoRepository;
    this.inventarioRepository = inventarioRepository;
    this.sequelize = sequelize;
    this.Inventario = inventarioModel;
  }

  async obtenerPedidos(user, query = {}) {
    try {
      const { page, limit, offset } = parsePagination(query);
      const options = {
        limit,
        offset,
        estado: query.estado,
        from: query.from,
        to: query.to
      };

      let result;
      if (user.rol === 'admin') {
        result = await this.pedidoRepository.findAll(options);
      } else {
        result = await this.pedidoRepository.findAllByUsuarioId(user.id, options);
      }

      return {
        data: result.rows.map((pedido) => sanitizePedido(pedido, user.rol === 'admin')),
        meta: buildPaginationMeta(result.count, page, limit)
      };
    } catch (error) {
      throw error;
    }
  }

  async obtenerPedidoPorId(id, user) {
    try {
      const pedido = await this.pedidoRepository.findById(id);

      if (!pedido) {
        throw new ApiError('Pedido no encontrado.', 404);
      }

      if (user.rol !== 'admin' && pedido.usuario_id !== user.id) {
        throw new ApiError('No tienes permisos para ver este pedido.', 403);
      }

      return sanitizePedido(pedido, true);
    } catch (error) {
      throw error;
    }
  }

  async cancelarPedido(id, user) {
    const transaction = await this.sequelize.transaction();

    try {
      const pedido = await this.pedidoRepository.findById(id, transaction);

      if (!pedido) {
        throw new ApiError('Pedido no encontrado.', 404);
      }

      if (user.rol !== 'admin' && pedido.usuario_id !== user.id) {
        throw new ApiError('No tienes permisos para cancelar este pedido.', 403);
      }

      if (pedido.estado === 'cancelado') {
        throw new ApiError('El pedido ya esta cancelado.', 400);
      }

      for (const detalle of pedido.detalles || []) {
        let inventario = await this.inventarioRepository.findOneByLibroAndUbicacion(
          detalle.libro_id,
          'almacen',
          0
        );

        if (!inventario) {
          inventario = await this.Inventario.create(
            {
              libro_id: detalle.libro_id,
              ubicacion_tipo: 'almacen',
              ubicacion_id: 0,
              stock: 0
            },
            { transaction }
          );
        }

        await inventario.update(
          {
            stock: inventario.stock + detalle.cantidad
          },
          { transaction }
        );
      }

      await this.pedidoRepository.update(
        pedido,
        {
          estado: 'cancelado'
        },
        transaction
      );

      await transaction.commit();

      const actualizado = await this.pedidoRepository.findById(id);
      return sanitizePedido(actualizado, true);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = PedidoService;

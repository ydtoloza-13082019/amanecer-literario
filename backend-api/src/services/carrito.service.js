const { Op, UniqueConstraintError } = require('sequelize');
const ApiError = require('../utils/ApiError');

class CarritoService {
  constructor(
    sequelize,
    carritoRepository,
    carritoItemRepository,
    pedidoRepository,
    detallePedidoRepository,
    usuarioModel,
    libroModel,
    inventarioModel
  ) {
    this.sequelize = sequelize;
    this.carritoRepository = carritoRepository;
    this.carritoItemRepository = carritoItemRepository;
    this.pedidoRepository = pedidoRepository;
    this.detallePedidoRepository = detallePedidoRepository;
    this.Usuario = usuarioModel;
    this.Libro = libroModel;
    this.Inventario = inventarioModel;
  }

  construirRespuestaCarrito(carrito) {
    const items = (carrito.items || []).map((item) => ({
      id: item.id,
      carrito_id: item.carrito_id,
      libro_id: item.libro_id,
      cantidad: item.cantidad,
      libro: item.libro
        ? {
            id: item.libro.id,
            titulo: item.libro.titulo,
            autor: item.libro.autor,
            isbn: item.libro.isbn,
            precio_actual: item.libro.precio
          }
        : null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    return {
      id: carrito.id,
      usuario_id: carrito.usuario_id,
      activo: carrito.activo,
      items,
      total_items: items.reduce((acc, item) => acc + item.cantidad, 0),
      createdAt: carrito.createdAt,
      updatedAt: carrito.updatedAt
    };
  }

  async validarUsuario(usuarioId, transaction = null) {
    const usuario = await this.Usuario.findByPk(usuarioId, { transaction });

    if (!usuario) {
      throw new ApiError('Usuario no encontrado.', 404);
    }

    return usuario;
  }

  async validarLibro(libroId, transaction = null) {
    const libro = await this.Libro.findByPk(libroId, { transaction });

    if (!libro) {
      throw new ApiError('Libro no encontrado.', 404);
    }

    if (!libro.activo) {
      throw new ApiError('El libro no esta disponible para la venta.', 400);
    }

    return libro;
  }

  async obtenerOCrearCarritoActivo(usuarioId, transaction = null, lock = false) {
    await this.validarUsuario(usuarioId, transaction);

    const activos = await this.carritoRepository.findActiveManyByUsuarioId(
      usuarioId,
      transaction
    );

    if (activos.length > 1) {
      for (let index = 1; index < activos.length; index += 1) {
        await this.carritoRepository.update(
          activos[index],
          { activo: false },
          transaction
        );
      }
    }

    let carrito = await this.carritoRepository.findActiveByUsuarioId(
      usuarioId,
      transaction,
      lock
    );

    if (!carrito) {
      try {
        carrito = await this.carritoRepository.create(
          {
            usuario_id: usuarioId,
            activo: true
          },
          transaction
        );
      } catch (error) {
        if (!(error instanceof UniqueConstraintError)) {
          throw error;
        }
      }

      carrito = await this.carritoRepository.findActiveByUsuarioId(
        usuarioId,
        transaction,
        lock
      );
    }

    return carrito;
  }

  async obtenerCarritoActual(usuarioId) {
    try {
      const carrito = await this.obtenerOCrearCarritoActivo(usuarioId);
      return this.construirRespuestaCarrito(carrito);
    } catch (error) {
      throw error;
    }
  }

  async agregarLibro(usuarioId, data) {
    try {
      const cantidad = Number(data.cantidad);

      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new ApiError('La cantidad debe ser un entero positivo.', 400);
      }

      await this.validarLibro(Number(data.libro_id));

      const carrito = await this.obtenerOCrearCarritoActivo(usuarioId);
      const itemExistente =
        await this.carritoItemRepository.findByCarritoAndLibro(
          carrito.id,
          Number(data.libro_id)
        );

      if (itemExistente) {
        await this.carritoItemRepository.update(itemExistente, {
          cantidad: itemExistente.cantidad + cantidad
        });
      } else {
        await this.carritoItemRepository.create({
          carrito_id: carrito.id,
          libro_id: Number(data.libro_id),
          cantidad
        });
      }

      const actualizado = await this.obtenerOCrearCarritoActivo(usuarioId);
      return this.construirRespuestaCarrito(actualizado);
    } catch (error) {
      throw error;
    }
  }

  async actualizarItem(usuarioId, itemId, data) {
    try {
      const cantidad = Number(data.cantidad);

      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new ApiError('La cantidad debe ser un entero positivo.', 400);
      }

      const carrito = await this.obtenerOCrearCarritoActivo(usuarioId);
      const item = await this.carritoItemRepository.findById(itemId);

      if (!item || item.carrito_id !== carrito.id) {
        throw new ApiError('Item de carrito no encontrado.', 404);
      }

      await this.carritoItemRepository.update(item, { cantidad });

      const actualizado = await this.obtenerOCrearCarritoActivo(usuarioId);
      return this.construirRespuestaCarrito(actualizado);
    } catch (error) {
      throw error;
    }
  }

  async eliminarItem(usuarioId, itemId) {
    try {
      const carrito = await this.obtenerOCrearCarritoActivo(usuarioId);
      const item = await this.carritoItemRepository.findById(itemId);

      if (!item || item.carrito_id !== carrito.id) {
        throw new ApiError('Item de carrito no encontrado.', 404);
      }

      await this.carritoItemRepository.delete(item);

      const actualizado = await this.obtenerOCrearCarritoActivo(usuarioId);
      return this.construirRespuestaCarrito(actualizado);
    } catch (error) {
      throw error;
    }
  }

  async confirmarCompra(usuarioId) {
    const transaction = await this.sequelize.transaction();

    try {
      const carrito = await this.obtenerOCrearCarritoActivo(
        usuarioId,
        transaction,
        transaction.LOCK.UPDATE
      );

      if (!carrito.items || carrito.items.length === 0) {
        throw new ApiError('El carrito esta vacio.', 400);
      }

      const movimientosInventario = [];
      const detalles = [];
      let total = 0;

      for (const item of carrito.items) {
        const libro = await this.validarLibro(item.libro_id, transaction);
        const precioUnitario = Number(libro.precio);
        const inventarios = await this.Inventario.findAll({
          where: {
            libro_id: item.libro_id,
            stock: {
              [Op.gt]: 0
            }
          },
          order: [['stock', 'DESC'], ['id', 'ASC']],
          transaction,
          lock: transaction.LOCK.UPDATE
        });

        const stockDisponible = inventarios.reduce(
          (acc, inventario) => acc + inventario.stock,
          0
        );

        if (stockDisponible < item.cantidad) {
          throw new ApiError(
            `No hay stock suficiente para el libro ${libro.titulo}.`,
            409
          );
        }

        let restante = item.cantidad;

        for (const inventario of inventarios) {
          if (restante === 0) {
            break;
          }

          const descuento = Math.min(inventario.stock, restante);
          movimientosInventario.push({
            inventario,
            nuevoStock: inventario.stock - descuento
          });

          restante -= descuento;
        }

        total += precioUnitario * item.cantidad;
        detalles.push({
          libro_id: item.libro_id,
          cantidad: item.cantidad,
          precio_unitario: precioUnitario
        });
      }

      const pedido = await this.pedidoRepository.create(
        {
          usuario_id: usuarioId,
          total,
          estado: 'confirmado'
        },
        transaction
      );

      await this.detallePedidoRepository.bulkCreate(
        detalles.map((detalle) => ({
          pedido_id: pedido.id,
          ...detalle
        })),
        transaction
      );

      for (const movimiento of movimientosInventario) {
        await movimiento.inventario.update(
          {
            stock: movimiento.nuevoStock
          },
          { transaction }
        );
      }

      for (const item of carrito.items) {
        await this.carritoItemRepository.delete(item, transaction);
      }

      await this.carritoRepository.update(
        carrito,
        {
          activo: false
        },
        transaction
      );

      await transaction.commit();

      return await this.pedidoRepository.findById(pedido.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = CarritoService;

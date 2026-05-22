const { Op, fn, col, literal } = require('sequelize');

class AdminDashboardRepository {
  constructor(PedidoModel, DetallePedidoModel, LibroModel, InventarioModel, FeriaModel) {
    this.Pedido = PedidoModel;
    this.DetallePedido = DetallePedidoModel;
    this.Libro = LibroModel;
    this.Inventario = InventarioModel;
    this.Feria = FeriaModel;
  }

  async getResumenGeneral() {
    const [resumen] = await this.Pedido.findAll({
      attributes: [
        [fn('COUNT', col('id')), 'total_pedidos'],
        [
          fn(
            'SUM',
            literal(
              "CASE WHEN estado = 'confirmado' THEN total ELSE 0 END"
            )
          ),
          'ventas_confirmadas'
        ],
        [
          fn(
            'SUM',
            literal(
              "CASE WHEN estado = 'cancelado' THEN 1 ELSE 0 END"
            )
          ),
          'pedidos_cancelados'
        ],
        [
          fn(
            'SUM',
            literal(
              "CASE WHEN estado = 'confirmado' THEN 1 ELSE 0 END"
            )
          ),
          'pedidos_confirmados'
        ]
      ],
      raw: true
    });

    return resumen;
  }

  async getPedidosPorEstado() {
    return this.Pedido.findAll({
      attributes: ['estado', [fn('COUNT', col('id')), 'total']],
      group: ['estado'],
      order: [['estado', 'ASC']],
      raw: true
    });
  }

  async getLibrosMasVendidos(limit = 5) {
    return this.DetallePedido.findAll({
      attributes: [
        'libro_id',
        [fn('SUM', col('cantidad')), 'cantidad_vendida'],
        [fn('SUM', literal('cantidad * precio_unitario')), 'total_vendido']
      ],
      include: [
        {
          model: this.Libro,
          as: 'libro',
          attributes: ['id', 'titulo', 'autor', 'isbn']
        },
        {
          model: this.Pedido,
          as: 'pedido',
          attributes: [],
          where: {
            estado: 'confirmado'
          }
        }
      ],
      group: ['libro_id', 'libro.id'],
      order: [[literal('cantidad_vendida'), 'DESC'], ['libro_id', 'ASC']],
      limit,
      subQuery: false
    });
  }

  async getStockBajo(threshold = 5, limit = 10) {
    return this.Inventario.findAll({
      where: {
        stock: {
          [Op.lte]: threshold
        }
      },
      include: [
        {
          model: this.Libro,
          as: 'libro',
          attributes: ['id', 'titulo', 'autor', 'isbn']
        },
        {
          model: this.Feria,
          as: 'feria',
          attributes: ['id', 'nombre', 'ciudad'],
          required: false
        }
      ],
      order: [['stock', 'ASC'], ['id', 'ASC']],
      limit
    });
  }
}

module.exports = AdminDashboardRepository;

class AdminDashboardService {
  constructor(adminDashboardRepository) {
    this.adminDashboardRepository = adminDashboardRepository;
  }

  async obtenerDashboard(query = {}) {
    try {
      const topLibros = Number(query.topLibros) > 0 ? Number(query.topLibros) : 5;
      const stockBajoLimite =
        Number(query.stockBajoLimite) > 0 ? Number(query.stockBajoLimite) : 10;
      const stockMinimo =
        Number(query.stockMinimo) >= 0 ? Number(query.stockMinimo) : 5;

      const [resumen, pedidosPorEstado, librosMasVendidos, stockBajo] =
        await Promise.all([
          this.adminDashboardRepository.getResumenGeneral(),
          this.adminDashboardRepository.getPedidosPorEstado(),
          this.adminDashboardRepository.getLibrosMasVendidos(topLibros),
          this.adminDashboardRepository.getStockBajo(stockMinimo, stockBajoLimite)
        ]);

      return {
        resumen: {
          total_pedidos: Number(resumen.total_pedidos || 0),
          ventas_confirmadas: Number(resumen.ventas_confirmadas || 0),
          pedidos_confirmados: Number(resumen.pedidos_confirmados || 0),
          pedidos_cancelados: Number(resumen.pedidos_cancelados || 0)
        },
        pedidos_por_estado: pedidosPorEstado.map((item) => ({
          estado: item.estado,
          total: Number(item.total || 0)
        })),
        libros_mas_vendidos: librosMasVendidos.map((item) => ({
          libro_id: item.libro_id,
          cantidad_vendida: Number(item.get('cantidad_vendida') || 0),
          total_vendido: Number(item.get('total_vendido') || 0),
          libro: item.libro
            ? {
                id: item.libro.id,
                titulo: item.libro.titulo,
                autor: item.libro.autor,
                isbn: item.libro.isbn
              }
            : null
        })),
        stock_bajo: stockBajo.map((inventario) => ({
          inventario_id: inventario.id,
          libro_id: inventario.libro_id,
          stock: inventario.stock,
          ubicacion_tipo: inventario.ubicacion_tipo,
          ubicacion_id: inventario.ubicacion_id,
          libro: inventario.libro
            ? {
                id: inventario.libro.id,
                titulo: inventario.libro.titulo,
                autor: inventario.libro.autor,
                isbn: inventario.libro.isbn
              }
            : null,
          feria: inventario.feria
            ? {
                id: inventario.feria.id,
                nombre: inventario.feria.nombre,
                ciudad: inventario.feria.ciudad
              }
            : null
        }))
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdminDashboardService;

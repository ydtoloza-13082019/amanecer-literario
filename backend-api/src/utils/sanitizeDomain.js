function sanitizeCategoria(categoria) {
  return {
    id: categoria.id,
    nombre: categoria.nombre,
    descripcion: categoria.descripcion,
    createdAt: categoria.createdAt,
    updatedAt: categoria.updatedAt
  };
}

function sanitizeFeria(feria) {
  return {
    id: feria.id,
    nombre: feria.nombre,
    ciudad: feria.ciudad,
    direccion: feria.direccion,
    fecha_inicio: feria.fecha_inicio,
    fecha_fin: feria.fecha_fin,
    activa: feria.activa,
    createdAt: feria.createdAt,
    updatedAt: feria.updatedAt
  };
}

function sanitizeInventario(inventario) {
  return {
    id: inventario.id,
    libro_id: inventario.libro_id,
    ubicacion_tipo: inventario.ubicacion_tipo,
    ubicacion_id: inventario.ubicacion_id,
    stock: inventario.stock,
    feria: inventario.feria
      ? {
          id: inventario.feria.id,
          nombre: inventario.feria.nombre,
          ciudad: inventario.feria.ciudad
        }
      : null,
    createdAt: inventario.createdAt,
    updatedAt: inventario.updatedAt
  };
}

function sanitizeLibro(libro, includeInventarios = false) {
  const payload = {
    id: libro.id,
    titulo: libro.titulo,
    autor: libro.autor,
    isbn: libro.isbn,
    precio: libro.precio,
    descripcion: libro.descripcion,
    activo: libro.activo,
    categoria_id: libro.categoria_id,
    categoria: libro.categoria
      ? {
          id: libro.categoria.id,
          nombre: libro.categoria.nombre
        }
      : null,
    createdAt: libro.createdAt,
    updatedAt: libro.updatedAt
  };

  if (includeInventarios) {
    payload.inventarios = (libro.inventarios || []).map((inventario) =>
      sanitizeInventario(inventario)
    );
  }

  return payload;
}

function sanitizeDetallePedido(detalle) {
  return {
    id: detalle.id,
    pedido_id: detalle.pedido_id,
    libro_id: detalle.libro_id,
    cantidad: detalle.cantidad,
    precio_unitario: detalle.precio_unitario,
    libro: detalle.libro
      ? {
          id: detalle.libro.id,
          titulo: detalle.libro.titulo,
          autor: detalle.libro.autor,
          isbn: detalle.libro.isbn
        }
      : null,
    createdAt: detalle.createdAt,
    updatedAt: detalle.updatedAt
  };
}

function sanitizePedido(pedido, includeUsuario = true) {
  const payload = {
    id: pedido.id,
    usuario_id: pedido.usuario_id,
    total: pedido.total,
    estado: pedido.estado,
    detalles: (pedido.detalles || []).map((detalle) =>
      sanitizeDetallePedido(detalle)
    ),
    createdAt: pedido.createdAt,
    updatedAt: pedido.updatedAt
  };

  if (includeUsuario && pedido.usuario) {
    payload.usuario = {
      id: pedido.usuario.id,
      nombre: pedido.usuario.nombre,
      email: pedido.usuario.email,
      rol: pedido.usuario.rol
    };
  }

  return payload;
}

module.exports = {
  sanitizeCategoria,
  sanitizeFeria,
  sanitizeInventario,
  sanitizeLibro,
  sanitizePedido
};

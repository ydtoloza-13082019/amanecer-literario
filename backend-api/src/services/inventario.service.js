const ApiError = require('../utils/ApiError');
const { parsePagination, buildPaginationMeta } = require('../utils/query');
const { sanitizeInventario } = require('../utils/sanitizeDomain');

class InventarioService {
  constructor(inventarioRepository, libroRepository, feriaRepository) {
    this.inventarioRepository = inventarioRepository;
    this.libroRepository = libroRepository;
    this.feriaRepository = feriaRepository;
  }

  normalizarUbicacion(data) {
    const ubicacionTipo = data.ubicacion_tipo;
    const ubicacionId =
      ubicacionTipo === 'almacen' ? 0 : Number(data.ubicacion_id);

    return {
      ...data,
      ubicacion_tipo: ubicacionTipo,
      ubicacion_id: ubicacionId
    };
  }

  
  async validarReglasDeInventario(data, inventarioIdExcluir = null) {
    const libro = await this.libroRepository.findById(data.libro_id);

    if (!libro) {
      throw new ApiError('El libro indicado no existe.', 404);
    }

    if (data.ubicacion_tipo === 'feria') {
      const feria = await this.feriaRepository.findById(data.ubicacion_id);

      if (!feria) {
        throw new ApiError('La feria indicada no existe.', 404);
      }
    }

    const existente = await this.inventarioRepository.findOneByLibroAndUbicacion(
      data.libro_id,
      data.ubicacion_tipo,
      data.ubicacion_id
    );

    if (existente && existente.id !== inventarioIdExcluir) {
      throw new ApiError(
        'Ya existe un inventario para este libro en esa ubicacion.',
        409
      );
    }
  }

  async crearInventario(data) {
    try {
      if (Number(data.stock) < 0) {
        throw new ApiError('El stock no puede ser negativo.', 400);
      }

      const payload = this.normalizarUbicacion(data);
      await this.validarReglasDeInventario(payload);
      const inventario = await this.inventarioRepository.create(payload);
      const conRelaciones = await this.inventarioRepository.findById(inventario.id);
      return sanitizeInventario(conRelaciones);
    } catch (error) {
      throw error;
    }
  }

  async obtenerInventarios(query = {}) {
    try {
      const { page, limit, offset } = parsePagination(query);
      const { count, rows } = await this.inventarioRepository.findAll({
        limit,
        offset,
        ubicacionTipo: query.ubicacion_tipo,
        libroId: query.libro_id ? Number(query.libro_id) : undefined,
        onlyAvailable: query.disponibles === 'true'
      });

      return {
        data: rows.map((inventario) => sanitizeInventario(inventario)),
        meta: buildPaginationMeta(count, page, limit)
      };
    } catch (error) {
      throw error;
    }
  }

  async obtenerInventarioPorId(id) {
    try {
      const inventario = await this.inventarioRepository.findById(id);

      if (!inventario) {
        throw new ApiError('Inventario no encontrado.', 404);
      }

      return sanitizeInventario(inventario);
    } catch (error) {
      throw error;
    }
  }

  async actualizarInventario(id, data) {
    try {
      const inventario = await this.inventarioRepository.findById(id);

      if (!inventario) {
        throw new ApiError('Inventario no encontrado.', 404);
      }

      const payload = this.normalizarUbicacion({
        libro_id: data.libro_id ?? inventario.libro_id,
        ubicacion_tipo: data.ubicacion_tipo ?? inventario.ubicacion_tipo,
        ubicacion_id: data.ubicacion_id ?? inventario.ubicacion_id,
        stock: data.stock ?? inventario.stock
      });

      if (Number(payload.stock) < 0) {
        throw new ApiError('El stock no puede ser negativo.', 400);
      }

      await this.validarReglasDeInventario(payload, inventario.id);

      const actualizado = await this.inventarioRepository.update(inventario, {
        ...data,
        ubicacion_tipo: payload.ubicacion_tipo,
        ubicacion_id: payload.ubicacion_id
      });
      const conRelaciones = await this.inventarioRepository.findById(actualizado.id);
      return sanitizeInventario(conRelaciones);
    } catch (error) {
      throw error;
    }
  }

  async eliminarInventario(id) {
    try {
      const inventario = await this.obtenerInventarioPorId(id);
      await this.inventarioRepository.delete(inventario);
      return { message: 'Inventario eliminado correctamente.' };
    } catch (error) {
      throw error;
    }
  }

  async obtenerDisponibilidadPorLibro(libroId) {
    try {
      const libro = await this.libroRepository.findById(libroId);

      if (!libro) {
        throw new ApiError('Libro no encontrado.', 404);
      }

      const inventarios = await this.inventarioRepository.findByLibroId(
        libroId,
        true
      );

      return {
        libro: {
          id: libro.id,
          titulo: libro.titulo,
          autor: libro.autor,
          isbn: libro.isbn,
          categoria: libro.categoria
            ? {
                id: libro.categoria.id,
                nombre: libro.categoria.nombre
              }
            : null
        },
        disponible_en: inventarios.map((inventario) => ({
          inventario_id: inventario.id,
          ubicacion_tipo: inventario.ubicacion_tipo,
          ubicacion_id: inventario.ubicacion_id,
          nombre_ubicacion:
            inventario.ubicacion_tipo === 'almacen'
              ? 'Almacen principal'
              : inventario.feria?.nombre || `Feria ${inventario.ubicacion_id}`,
          stock: inventario.stock
        }))
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = InventarioService;

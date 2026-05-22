const ApiError = require('../utils/ApiError');
const { parsePagination, buildPaginationMeta } = require('../utils/query');
const { sanitizeLibro } = require('../utils/sanitizeDomain');

class LibroService {
  constructor(libroRepository, categoriaRepository) {
    this.libroRepository = libroRepository;
    this.categoriaRepository = categoriaRepository;
  }

  async crearLibro(data) {
    try {
      if (Number(data.precio) < 0) {
        throw new ApiError('El precio no puede ser negativo.', 400);
      }

      const categoria = await this.categoriaRepository.findById(data.categoria_id);

      if (!categoria) {
        throw new ApiError('La categoria indicada no existe.', 404);
      }

      return await this.libroRepository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async obtenerLibros(query = {}) {
    try {
      const { page, limit, offset } = parsePagination(query);
      const activo =
        query.activo === undefined ? undefined : query.activo === 'true';
      const categoriaId = query.categoria_id ? Number(query.categoria_id) : undefined;
      const { count, rows } = await this.libroRepository.findAll({
        limit,
        offset,
        search: query.search?.trim(),
        categoriaId,
        activo
      });

      return {
        data: rows.map((libro) => sanitizeLibro(libro)),
        meta: buildPaginationMeta(count, page, limit)
      };
    } catch (error) {
      throw error;
    }
  }

  async obtenerLibroPorId(id) {
    try {
      const libro = await this.libroRepository.findById(id);

      if (!libro) {
        throw new ApiError('Libro no encontrado.', 404);
      }

      return sanitizeLibro(libro, true);
    } catch (error) {
      throw error;
    }
  }

  async actualizarLibro(id, data) {
    try {
      const libro = await this.libroRepository.findById(id);

      if (!libro) {
        throw new ApiError('Libro no encontrado.', 404);
      }

      if (data.categoria_id) {
        const categoria = await this.categoriaRepository.findById(data.categoria_id);

        if (!categoria) {
          throw new ApiError('La categoria indicada no existe.', 404);
        }
      }

      if (data.precio !== undefined && Number(data.precio) < 0) {
        throw new ApiError('El precio no puede ser negativo.', 400);
      }

      const actualizado = await this.libroRepository.update(libro, data);
      return sanitizeLibro(actualizado);
    } catch (error) {
      throw error;
    }
  }

  async eliminarLibro(id) {
    try {
      const libro = await this.obtenerLibroPorId(id);
      await this.libroRepository.delete(libro);
      return { message: 'Libro eliminado correctamente.' };
    } catch (error) {
      throw error;
    }
  }
}


module.exports = LibroService;

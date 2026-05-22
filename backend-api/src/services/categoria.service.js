const ApiError = require('../utils/ApiError');
const { parsePagination, buildPaginationMeta } = require('../utils/query');
const { sanitizeCategoria } = require('../utils/sanitizeDomain');

class CategoriaService {
  constructor(categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  async crearCategoria(data) {
    try {
      return await this.categoriaRepository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async obtenerCategorias(query = {}) {
    try {
      const { page, limit, offset } = parsePagination(query);
      const { count, rows } = await this.categoriaRepository.findAll({
        limit,
        offset,
        search: query.search?.trim()
      });

      return {
        data: rows.map((categoria) => sanitizeCategoria(categoria)),
        meta: buildPaginationMeta(count, page, limit)
      };
    } catch (error) {
      throw error;
    }
  }

  async obtenerCategoriaPorId(id) {
    try {
      const categoria = await this.categoriaRepository.findById(id);

      if (!categoria) {
        throw new ApiError('Categoria no encontrada.', 404);
      }

      return sanitizeCategoria(categoria);
    } catch (error) {
      throw error;
    }
  }

  async actualizarCategoria(id, data) {
    try {
      const categoria = await this.obtenerCategoriaPorId(id);
      const actualizada = await this.categoriaRepository.update(categoria, data);
      return sanitizeCategoria(actualizada);
    } catch (error) {
      throw error;
    }
  }

  async eliminarCategoria(id) {
    try {
      const categoria = await this.obtenerCategoriaPorId(id);
      await this.categoriaRepository.delete(categoria);
      return { message: 'Categoria eliminada correctamente.' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoriaService;

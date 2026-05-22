const ApiError = require('../utils/ApiError');
const { parsePagination, buildPaginationMeta } = require('../utils/query');
const { sanitizeFeria } = require('../utils/sanitizeDomain');

class FeriaService {
  constructor(feriaRepository) {
    this.feriaRepository = feriaRepository;
  }

  async crearFeria(data) {
    try {
      return await this.feriaRepository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async obtenerFerias(query = {}) {
    try {
      const { page, limit, offset } = parsePagination(query);
      const activa =
        query.activa === undefined ? undefined : query.activa === 'true';
      const { count, rows } = await this.feriaRepository.findAll({
        limit,
        offset,
        search: query.search?.trim(),
        activa
      });

      return {
        data: rows.map((feria) => sanitizeFeria(feria)),
        meta: buildPaginationMeta(count, page, limit)
      };
    } catch (error) {
      throw error;
    }
  }

  async obtenerFeriaPorId(id) {
    try {
      const feria = await this.feriaRepository.findById(id);

      if (!feria) {
        throw new ApiError('Feria no encontrada.', 404);
      }

      return sanitizeFeria(feria);
    } catch (error) {
      throw error;
    }
  }

  async actualizarFeria(id, data) {
    try {
      const feria = await this.obtenerFeriaPorId(id);
      const actualizada = await this.feriaRepository.update(feria, data);
      return sanitizeFeria(actualizada);
    } catch (error) {
      throw error;
    }
  }

  async eliminarFeria(id) {
    try {
      const feria = await this.obtenerFeriaPorId(id);
      await this.feriaRepository.delete(feria);
      return { message: 'Feria eliminada correctamente.' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FeriaService;

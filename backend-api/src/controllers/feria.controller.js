class FeriaController {
  constructor(feriaService) {
    this.feriaService = feriaService;
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  async index(req, res, next) {
    try {
      const ferias = await this.feriaService.obtenerFerias(req.query);
      res.status(200).json(ferias);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const feria = await this.feriaService.obtenerFeriaPorId(
        Number(req.params.id)
      );
      res.status(200).json(feria);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const feria = await this.feriaService.crearFeria(req.body);
      res.status(201).json(feria);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const feria = await this.feriaService.actualizarFeria(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(feria);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      const respuesta = await this.feriaService.eliminarFeria(
        Number(req.params.id)
      );
      res.status(200).json(respuesta);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FeriaController;

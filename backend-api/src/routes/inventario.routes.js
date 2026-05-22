const express = require('express');
const InventarioController = require('../controllers/inventario.controller');
const InventarioRepository = require('../repositories/inventario.repository');
const LibroRepository = require('../repositories/libro.repository');
const FeriaRepository = require('../repositories/feria.repository');
const InventarioService = require('../services/inventario.service');
const validateRequiredFields = require('../middlewares/validateRequiredFields.middleware');
const validateIdParam = require('../middlewares/validateIdParam.middleware');
const autenticarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/role.middleware');
const { Inventario, Libro, Feria, Categoria } = require('../models');

const router = express.Router();

const inventarioRepository = new InventarioRepository(Inventario, Libro, Feria);
const libroRepository = new LibroRepository(Libro, Categoria, Inventario, Feria);
const feriaRepository = new FeriaRepository(Feria);

const inventarioService = new InventarioService(
  inventarioRepository,
  libroRepository,
  feriaRepository
);

const inventarioController = new InventarioController(inventarioService);

/* ========= RUTA ESPECIAL (VA PRIMERO SIEMPRE) ========= */
router.get(
  '/libro/:libroId/disponibilidad',
  autenticarToken,
  verificarRol('admin', 'cliente'),
  validateIdParam('libroId'),
  inventarioController.disponibilidadPorLibro
);

/* ========= CRUD NORMAL ========= */
router.get('/', autenticarToken, verificarRol('admin', 'cliente'), inventarioController.index);

router.post(
  '/',
  autenticarToken,
  verificarRol('admin'),
  validateRequiredFields(['libro_id', 'ubicacion_tipo', 'stock']),
  inventarioController.store
);

/* ========= RUTAS CON :id SIEMPRE AL FINAL ========= */
router.get(
  '/:id',
  autenticarToken,
  verificarRol('admin', 'cliente'),
  validateIdParam(),
  inventarioController.show
);

router.put(
  '/:id',
  autenticarToken,
  verificarRol('admin'),
  validateIdParam(),
  inventarioController.update
);

router.delete(
  '/:id',
  autenticarToken,
  verificarRol('admin'),
  validateIdParam(),
  inventarioController.destroy
);

module.exports = router;

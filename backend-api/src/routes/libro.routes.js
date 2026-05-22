const express = require('express');
const LibroController = require('../controllers/libro.controller');
const LibroRepository = require('../repositories/libro.repository');
const CategoriaRepository = require('../repositories/categoria.repository');
const LibroService = require('../services/libro.service');
const validateRequiredFields = require('../middlewares/validateRequiredFields.middleware');
const validateIdParam = require('../middlewares/validateIdParam.middleware');
const autenticarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/role.middleware');

const InventarioController = require('../controllers/inventario.controller');
const InventarioRepository = require('../repositories/inventario.repository');
const FeriaRepository = require('../repositories/feria.repository');
const InventarioService = require('../services/inventario.service');

const { Libro, Categoria, Inventario, Feria } = require('../models');

const router = express.Router();

// ===== Libro =====
const libroRepository = new LibroRepository(Libro, Categoria, Inventario, Feria);
const categoriaRepository = new CategoriaRepository(Categoria);
const libroService = new LibroService(libroRepository, categoriaRepository);
const libroController = new LibroController(libroService);

// ===== Inventario (para disponibilidad) =====
const feriaRepository = new FeriaRepository(Feria);
const inventarioRepository = new InventarioRepository(Inventario, Libro, Feria);
const inventarioService = new InventarioService(
  inventarioRepository,
  libroRepository,
  feriaRepository
);
const inventarioController = new InventarioController(inventarioService);

// ===== Rutas =====

router.get('/', autenticarToken, verificarRol('admin', 'cliente'), libroController.index);


router.get(
  '/:libroId/disponibilidad',
  autenticarToken,
  verificarRol('admin', 'cliente'),
  validateIdParam('libroId'),
  inventarioController.disponibilidadPorLibro
);

router.get(
  '/:id',
  autenticarToken,
  verificarRol('admin', 'cliente'),
  validateIdParam(),
  libroController.show
);

router.post(
  '/',
  autenticarToken,
  verificarRol('admin'),
  validateRequiredFields(['titulo', 'autor', 'isbn', 'precio', 'categoria_id']),
  libroController.store
);

router.put(
  '/:id',
  autenticarToken,
  verificarRol('admin'),
  validateIdParam(),
  libroController.update
);

router.delete(
  '/:id',
  autenticarToken,
  verificarRol('admin'),
  validateIdParam(),
  libroController.destroy
);

module.exports = router;

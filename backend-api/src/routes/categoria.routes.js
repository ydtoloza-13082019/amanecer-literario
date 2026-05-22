const express = require('express');
const CategoriaController = require('../controllers/categoria.controller');
const CategoriaRepository = require('../repositories/categoria.repository');
const CategoriaService = require('../services/categoria.service');
const validateRequiredFields = require('../middlewares/validateRequiredFields.middleware');
const validateIdParam = require('../middlewares/validateIdParam.middleware');
const autenticarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/role.middleware');
const { Categoria } = require('../models');

const router = express.Router();

const categoriaRepository = new CategoriaRepository(Categoria);
const categoriaService = new CategoriaService(categoriaRepository);
const categoriaController = new CategoriaController(categoriaService);

router.get('/', autenticarToken, verificarRol('admin', 'cliente'), categoriaController.index);
router.get(
  '/:id',
  autenticarToken,
  verificarRol('admin', 'cliente'),
  validateIdParam(),
  categoriaController.show
);
router.post(
  '/',
  autenticarToken,
  verificarRol('admin'),
  validateRequiredFields(['nombre']),
  categoriaController.store
);
router.put(
  '/:id',
  autenticarToken,
  verificarRol('admin'),
  validateIdParam(),
  categoriaController.update
);
router.delete(
  '/:id',
  autenticarToken,
  verificarRol('admin'),
  validateIdParam(),
  categoriaController.destroy
);

module.exports = router;

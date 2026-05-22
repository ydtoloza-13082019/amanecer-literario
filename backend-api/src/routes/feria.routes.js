const express = require('express');
const FeriaController = require('../controllers/feria.controller');
const FeriaRepository = require('../repositories/feria.repository');
const FeriaService = require('../services/feria.service');
const validateRequiredFields = require('../middlewares/validateRequiredFields.middleware');
const validateIdParam = require('../middlewares/validateIdParam.middleware');
const autenticarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/role.middleware');
const { Feria } = require('../models');

const router = express.Router();

const feriaRepository = new FeriaRepository(Feria);
const feriaService = new FeriaService(feriaRepository);
const feriaController = new FeriaController(feriaService);

router.get('/', autenticarToken, verificarRol('admin', 'cliente'), feriaController.index);
router.get(
  '/:id',
  autenticarToken,
  verificarRol('admin', 'cliente'),
  validateIdParam(),
  feriaController.show
);
router.post(
  '/',
  autenticarToken,
  verificarRol('admin'),
  validateRequiredFields([
    'nombre',
    'ciudad',
    'direccion',
    'fecha_inicio',
    'fecha_fin'
  ]),
  feriaController.store
);
router.put(
  '/:id',
  autenticarToken,
  verificarRol('admin'),
  validateIdParam(),
  feriaController.update
);
router.delete(
  '/:id',
  autenticarToken,
  verificarRol('admin'),
  validateIdParam(),
  feriaController.destroy
);

module.exports = router;

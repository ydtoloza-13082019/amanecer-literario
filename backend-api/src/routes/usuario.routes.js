const express = require('express');
const UsuarioController = require('../controllers/usuario.controller');
const UsuarioRepository = require('../repositories/usuario.repository');
const UsuarioService = require('../services/usuario.service');
const validateRequiredFields = require('../middlewares/validateRequiredFields.middleware');
const validateIdParam = require('../middlewares/validateIdParam.middleware');
const autenticarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/role.middleware');
const { Usuario } = require('../models');

const router = express.Router();

const usuarioRepository = new UsuarioRepository(Usuario);
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

router.get('/', autenticarToken, verificarRol('admin'), usuarioController.index);
router.get(
  '/:id',
  autenticarToken,
  verificarRol('admin'),
  validateIdParam(),
  usuarioController.show
);
router.post(
  '/',
  autenticarToken,
  verificarRol('admin'),
  validateRequiredFields(['nombre', 'email', 'password', 'rol']),
  usuarioController.store
);
router.put(
  '/:id',
  autenticarToken,
  validateIdParam(),
  usuarioController.update
);
router.delete(
  '/:id',
  autenticarToken,
  verificarRol('admin'),
  validateIdParam(),
  usuarioController.destroy
);

module.exports = router;


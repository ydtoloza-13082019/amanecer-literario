const express = require('express');
const AuthController = require('../controllers/auth.controller');
const AuthService = require('../services/auth.service');
const UsuarioService = require('../services/usuario.service');
const UsuarioRepository = require('../repositories/usuario.repository');
const validateRequiredFields = require('../middlewares/validateRequiredFields.middleware');
const autenticarToken = require('../middlewares/auth.middleware');
const { Usuario } = require('../models');

const router = express.Router();

const usuarioRepository = new UsuarioRepository(Usuario);
const usuarioService = new UsuarioService(usuarioRepository);
const authService = new AuthService(usuarioRepository, usuarioService);
const authController = new AuthController(authService);

router.post(
  '/register',
  validateRequiredFields(['nombre', 'email', 'password']),
  authController.register
);

router.post(
  '/login',
  validateRequiredFields(['email', 'password']),
  authController.login
);

router.get('/me', autenticarToken, authController.me);

module.exports = router;


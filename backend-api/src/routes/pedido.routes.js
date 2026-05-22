const express = require('express');
const PedidoController = require('../controllers/pedido.controller');
const PedidoRepository = require('../repositories/pedido.repository');
const InventarioRepository = require('../repositories/inventario.repository');
const PedidoService = require('../services/pedido.service');
const validateIdParam = require('../middlewares/validateIdParam.middleware');
const autenticarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/role.middleware');
const {
  sequelize,
  Pedido,
  DetallePedido,
  Libro,
  Usuario,
  Inventario,
  Feria
} = require('../models');

const router = express.Router();

const pedidoRepository = new PedidoRepository(Pedido, DetallePedido, Libro, Usuario);
const inventarioRepository = new InventarioRepository(Inventario, Libro, Feria);
const pedidoService = new PedidoService(
  pedidoRepository,
  inventarioRepository,
  sequelize,
  Inventario
);
const pedidoController = new PedidoController(pedidoService);

router.get(
  '/',
  autenticarToken,
  verificarRol('cliente', 'admin'),
  pedidoController.index
);

router.get(
  '/:id',
  autenticarToken,
  verificarRol('cliente', 'admin'),
  validateIdParam(),
  pedidoController.show
);

router.patch(
  '/:id/cancelar',
  autenticarToken,
  verificarRol('cliente', 'admin'),
  validateIdParam(),
  pedidoController.cancel
);

module.exports = router;

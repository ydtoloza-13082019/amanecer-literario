const express = require('express');
const CarritoController = require('../controllers/carrito.controller');
const CarritoRepository = require('../repositories/carrito.repository');
const CarritoItemRepository = require('../repositories/carrito-item.repository');
const PedidoRepository = require('../repositories/pedido.repository');
const DetallePedidoRepository = require('../repositories/detalle-pedido.repository');
const CarritoService = require('../services/carrito.service');
const validateRequiredFields = require('../middlewares/validateRequiredFields.middleware');
const validateIdParam = require('../middlewares/validateIdParam.middleware');
const autenticarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/role.middleware');
const {
  sequelize,
  Carrito,
  CarritoItem,
  Pedido,
  DetallePedido,
  Usuario,
  Libro,
  Inventario
} = require('../models');

const router = express.Router();

const carritoRepository = new CarritoRepository(Carrito, CarritoItem, Libro);
const carritoItemRepository = new CarritoItemRepository(CarritoItem, Libro);
const pedidoRepository = new PedidoRepository(Pedido, DetallePedido, Libro, Usuario);
const detallePedidoRepository = new DetallePedidoRepository(DetallePedido);
const carritoService = new CarritoService(
  sequelize,
  carritoRepository,
  carritoItemRepository,
  pedidoRepository,
  detallePedidoRepository,
  Usuario,
  Libro,
  Inventario
);
const carritoController = new CarritoController(carritoService);

router.get(
  '/',
  autenticarToken,
  verificarRol('cliente', 'admin'),
  carritoController.show
);

router.post(
  '/agregar',
  autenticarToken,
  verificarRol('cliente', 'admin'),
  validateRequiredFields(['libro_id', 'cantidad']),
  carritoController.agregar
);

router.put(
  '/item/:id',
  autenticarToken,
  verificarRol('cliente', 'admin'),
  validateIdParam(),
  validateRequiredFields(['cantidad']),
  carritoController.updateItem
);

router.delete(
  '/item/:id',
  autenticarToken,
  verificarRol('cliente', 'admin'),
  validateIdParam(),
  carritoController.deleteItem
);

router.post(
  '/confirmar',
  autenticarToken,
  verificarRol('cliente', 'admin'),
  carritoController.confirmar
);

module.exports = router;


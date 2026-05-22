const express = require('express');
const AdminDashboardController = require('../controllers/admin-dashboard.controller');
const AdminDashboardRepository = require('../repositories/admin-dashboard.repository');
const AdminDashboardService = require('../services/admin-dashboard.service');
const autenticarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/role.middleware');
const { Pedido, DetallePedido, Libro, Inventario, Feria } = require('../models');

const router = express.Router();

const adminDashboardRepository = new AdminDashboardRepository(
  Pedido,
  DetallePedido,
  Libro,
  Inventario,
  Feria
);
const adminDashboardService = new AdminDashboardService(adminDashboardRepository);
const adminDashboardController = new AdminDashboardController(
  adminDashboardService
);

router.get(
  '/dashboard',
  autenticarToken,
  verificarRol('admin'),
  adminDashboardController.index
);

module.exports = router;

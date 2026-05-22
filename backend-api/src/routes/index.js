const express = require('express');
const authRoutes = require('./auth.routes');
const usuarioRoutes = require('./usuario.routes');
const categoriaRoutes = require('./categoria.routes');
const libroRoutes = require('./libro.routes');
const feriaRoutes = require('./feria.routes');
const inventarioRoutes = require('./inventario.routes');
const carritoRoutes = require('./carrito.routes');
const pedidoRoutes = require('./pedido.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/libros', libroRoutes);
router.use('/ferias', feriaRoutes);
router.use('/inventarios', inventarioRoutes);
router.use('/carrito', carritoRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

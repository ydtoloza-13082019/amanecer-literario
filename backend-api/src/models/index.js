const sequelize = require('../config/database');
const CategoriaModel = require('./categoria.model');
const LibroModel = require('./libro.model');
const FeriaModel = require('./feria.model');
const InventarioModel = require('./inventario.model');
const UsuarioModel = require('./usuario.model');
const CarritoModel = require('./carrito.model');
const CarritoItemModel = require('./carrito-item.model');
const PedidoModel = require('./pedido.model');
const DetallePedidoModel = require('./detalle-pedido.model');

const Categoria = CategoriaModel(sequelize);
const Libro = LibroModel(sequelize);
const Feria = FeriaModel(sequelize);
const Inventario = InventarioModel(sequelize);
const Usuario = UsuarioModel(sequelize);
const Carrito = CarritoModel(sequelize);
const CarritoItem = CarritoItemModel(sequelize);
const Pedido = PedidoModel(sequelize);
const DetallePedido = DetallePedidoModel(sequelize);

const db = {
  sequelize,
  Categoria,
  Libro,
  Feria,
  Inventario,
  Usuario,
  Carrito,
  CarritoItem,
  Pedido,
  DetallePedido
};

Object.values(db).forEach((model) => {
  if (model && typeof model.associate === 'function') {
    model.associate(db);
  }
});

module.exports = db;

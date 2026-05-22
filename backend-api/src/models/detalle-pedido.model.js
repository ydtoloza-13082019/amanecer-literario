const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class DetallePedido extends Model {
    static associate(models) {
      DetallePedido.belongsTo(models.Pedido, {
        foreignKey: 'pedido_id',
        as: 'pedido'
      });

      DetallePedido.belongsTo(models.Libro, {
        foreignKey: 'libro_id',
        as: 'libro'
      });
    }
  }

  DetallePedido.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      libro_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        }
      },
      precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      }
    },
    {
      sequelize,
      modelName: 'DetallePedido',
      tableName: 'detalle_pedidos'
    }
  );

  return DetallePedido;
};


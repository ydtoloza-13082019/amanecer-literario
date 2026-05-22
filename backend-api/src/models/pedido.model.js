const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Pedido extends Model {
    static associate(models) {
      Pedido.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });

      Pedido.hasMany(models.DetallePedido, {
        foreignKey: 'pedido_id',
        as: 'detalles'
      });
    }
  }

  Pedido.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      estado: {
        type: DataTypes.ENUM('pendiente', 'confirmado', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendiente'
      }
    },
    {
      sequelize,
      modelName: 'Pedido',
      tableName: 'pedidos'
    }
  );

  return Pedido;
};


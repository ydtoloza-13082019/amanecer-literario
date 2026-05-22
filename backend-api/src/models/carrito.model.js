const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Carrito extends Model {
    static associate(models) {
      Carrito.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });

      Carrito.hasMany(models.CarritoItem, {
        foreignKey: 'carrito_id',
        as: 'items'
      });
    }
  }

  Carrito.init(
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
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Carrito',
      tableName: 'carritos'
    }
  );

  return Carrito;
};


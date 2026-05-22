const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class CarritoItem extends Model {
    static associate(models) {
      CarritoItem.belongsTo(models.Carrito, {
        foreignKey: 'carrito_id',
        as: 'carrito'
      });

      CarritoItem.belongsTo(models.Libro, {
        foreignKey: 'libro_id',
        as: 'libro'
      });
    }
  }

  CarritoItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      carrito_id: {
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
      }
    },
    {
      sequelize,
      modelName: 'CarritoItem',
      tableName: 'carrito_items',
      indexes: [
        {
          unique: true,
          fields: ['carrito_id', 'libro_id']
        }
      ]
    }
  );

  return CarritoItem;
};


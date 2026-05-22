const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Inventario extends Model {
    static associate(models) {
      Inventario.belongsTo(models.Libro, {
        foreignKey: 'libro_id',
        as: 'libro'
      });

      Inventario.belongsTo(models.Feria, {
        foreignKey: 'ubicacion_id',
        as: 'feria',
        constraints: false
      });
    }
  }

  Inventario.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      libro_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ubicacion_tipo: {
        type: DataTypes.ENUM('almacen', 'feria'),
        allowNull: false
      },
      ubicacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
      }
    },
    {
      sequelize,
      modelName: 'Inventario',
      tableName: 'inventarios',
      indexes: [
        {
          unique: true,
          fields: ['libro_id', 'ubicacion_tipo', 'ubicacion_id']
        }
      ],
      validate: {
        ubicacionValida() {
          if (this.ubicacion_tipo === 'almacen' && this.ubicacion_id !== 0) {
            throw new Error('Para almacen, ubicacion_id debe ser 0.');
          }

          if (this.ubicacion_tipo === 'feria' && this.ubicacion_id <= 0) {
            throw new Error('Para feria, ubicacion_id debe ser mayor a 0.');
          }
        }
      }
    }
  );

  return Inventario;
};

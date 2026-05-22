const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Feria extends Model {
    static associate(models) {
      Feria.hasMany(models.Inventario, {
        foreignKey: 'ubicacion_id',
        constraints: false,
        scope: {
          ubicacion_tipo: 'feria'
        },
        as: 'inventarios'
      });
    }
  }

  Feria.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      ciudad: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      direccion: {
        type: DataTypes.STRING(180),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      activa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Feria',
      tableName: 'ferias'
    }
  );

  return Feria;
};


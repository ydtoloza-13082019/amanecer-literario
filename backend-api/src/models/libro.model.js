const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Libro extends Model {
    static associate(models) {
      Libro.belongsTo(models.Categoria, {
        foreignKey: 'categoria_id',
        as: 'categoria'
      });

      Libro.hasMany(models.Inventario, {
        foreignKey: 'libro_id',
        as: 'inventarios'
      });
    }
  }

  Libro.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      titulo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      autor: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      isbn: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Libro',
      tableName: 'libros'
    }
  );

  return Libro;
};


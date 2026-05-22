const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Categoria extends Model {
    static associate(models) {
      Categoria.hasMany(models.Libro, {
        foreignKey: 'categoria_id',
        as: 'libros'
      });
    }
  }

  Categoria.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Categoria',
      tableName: 'categorias'
    }
  );

  return Categoria;
};


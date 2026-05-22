const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate() {}
  }

  Usuario.init(
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
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 255]
        }
      },
      rol: {
        type: DataTypes.ENUM('admin', 'cliente'),
        allowNull: false,
        defaultValue: 'cliente'
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios'
    }
  );

  return Usuario;
};


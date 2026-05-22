require('./config/env');
const app = require('./app');
const { sequelize, Usuario } = require('./models');
const ensureSingleActiveCartConstraint = require('./config/cartConstraint');
const UsuarioRepository = require('./repositories/usuario.repository');
const UsuarioService = require('./services/usuario.service');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexion a MySQL establecida correctamente.');

    await sequelize.sync();
    console.log('Modelos sincronizados correctamente.');

    await ensureSingleActiveCartConstraint(sequelize);
    console.log('Restriccion de carrito activo verificada correctamente.');

    const usuarioRepository = new UsuarioRepository(Usuario);
    const usuarioService = new UsuarioService(usuarioRepository);

    if ((await usuarioRepository.countAll()) === 0) {
      await usuarioService.crearUsuario({
        nombre: 'Administrador inicial',
        email: 'admin@amanecerliterario.com',
        password: 'Admin12345',
        rol: 'admin'
      });
      console.log('Usuario admin inicial creado: admin@amanecerliterario.com / Admin12345');
    }

    app.listen(PORT, () => {
      console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();

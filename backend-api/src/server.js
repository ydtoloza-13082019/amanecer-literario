require('./config/env');
const app = require('./app');

const PORT = process.env.PORT || 3000;

function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutandose en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
  }
}

startServer();
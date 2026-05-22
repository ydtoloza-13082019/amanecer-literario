const express = require('express');
const routes = require('./routes/index');
const setupSwagger = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler.middleware');
const { sequelize } = require('./models');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
setupSwagger(app);

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Amanecer Literario API operativa.'
  });
});

app.get('/health/db', async (req, res) => {
  const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);

  if (missingEnv.length > 0) {
    return res.status(503).json({
      ok: false,
      message: 'Faltan variables de entorno para conectar la base de datos.',
      missingEnv
    });
  }

  try {
    await sequelize.authenticate();
    res.status(200).json({
      ok: true,
      message: 'Conexion a base de datos operativa.'
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      message: 'No se pudo conectar a la base de datos.',
      detail: error.message || error.parent?.message || error.original?.message || error.name
    });
  }
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Ruta no encontrada.'
  });
});

app.use(errorHandler);

module.exports = app;

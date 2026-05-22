const express = require('express');
const routes = require('./routes/index');
const setupSwagger = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler.middleware');

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

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Ruta no encontrada.'
  });
});

app.use(errorHandler);

module.exports = app;

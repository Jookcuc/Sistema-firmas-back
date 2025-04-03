import express from 'express';
import { PORT } from '../config/config.js';
import routerUser from '../routes/user/index.js';
import routerLicense from '../routes/license/index.js';

const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:5173',
  'https://sistema-firmas-production.up.railway.app'
];

// Middleware de CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Manejo de preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/users', routerUser);
app.use('/api/licenses', routerLicense);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

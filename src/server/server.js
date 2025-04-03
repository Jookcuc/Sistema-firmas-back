import express from 'express';
import cors from 'cors';
import { PORT } from '../config/config.js';
import routerUser from '../routes/user/index.js';
import routerLicense from '../routes/license/index.js';

const app = express();

app.use(cors())

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/users', routerUser);
app.use('/api/licenses', routerLicense);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

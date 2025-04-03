import express from 'express';
import cors from 'cors';
import { PORT } from '../config/config.js';
import routerUser from '../routes/user/index.js';
import routerLicense from '../routes/license/index.js';

const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:5173',
  'https://sistema-firmas-production.up.railway.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/users', routerUser);
app.use('/api/licenses', routerLicense);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

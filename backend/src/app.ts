import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import router from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app: Express = express();

app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN
}));
app.use(express.json());

app.use('/api', router);

app.use(errorHandler);

export default app;

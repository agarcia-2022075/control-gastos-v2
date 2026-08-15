import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import router from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app: Express = express();

// Disable ETags to prevent 304 Not Modified responses on API requests
app.set('etag', false);

app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN
}));
app.use(express.json());

// Prevent browser caching of API responses
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  next();
});

app.use('/api', router);

app.use(errorHandler);

export default app;

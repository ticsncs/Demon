import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initializeDatabase } from './infra/db/database';
import apiRouter from './infra/web/api';
import loginRouter from './infra/web/login';
import path from 'path';
import { getSession, removeSession } from './domain/session';

const app = express();
const port = 3000;

// IMPORTANTE: Confiar en el proxy (Nginx)
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// --- Health Check ---
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// --- Public Routes for Login ---
app.get('/admin/login', (_req, res) => {
    res.sendFile(path.join(__dirname, 'infra/web/login.html'));
});

app.use('/admin', loginRouter);

// --- Middleware for Protected Admin Routes ---
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const sessionId = req.cookies.sessionId;
  console.log('[AUTH] Cookie recibida:', sessionId);
  
  const session = getSession(sessionId);
  console.log('[AUTH] Sesión encontrada:', !!session);
  
  if (session) {
    next();
  } else {
    console.log('[AUTH] Redirigiendo a login');
    res.redirect('/admin/login');
  }
};

// --- Protected Admin Routes ---
app.get('/admin', authMiddleware, (_req, res) => {
  console.log('[ADMIN] Sirviendo panel de administración');
    res.sendFile(path.join(__dirname, 'infra/web/admin.html'));
});

app.post('/admin/logout', authMiddleware, (req, res) => {
  const sessionId = req.cookies.sessionId;
  removeSession(sessionId);
  res.clearCookie('sessionId');
  res.status(200).json({ message: 'Logged out' });
});

// --- API Routes ---
app.use('/api', apiRouter);

// --- Server Initialization ---
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Admin panel is available at http://localhost:${port}/admin/login`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

import { Router } from 'express';
import { db } from '../db/database';
import { createSession } from '../../domain/session';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('[LOGIN] Intento de login:', { username });
  try {
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);
    console.log('[LOGIN] Usuario encontrado:', user ? user.username : 'No encontrado');
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log('[LOGIN] Resultado bcrypt:', passwordMatch);
      if (passwordMatch) {
        const session = createSession(user.id);
        console.log('[LOGIN] Sesión creada:', session.id);
        res.cookie('sessionId', session.id, { httpOnly: true, sameSite: 'strict' });
        res.status(200).send({ message: 'Logged in' });
        return;
      }
    }
    console.log('[LOGIN] Credenciales inválidas');
    res.status(401).send({ error: 'Invalid credentials' });
  } catch (err) {
    console.error('[LOGIN] Error en login:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

export default router;

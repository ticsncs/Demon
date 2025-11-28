import { Router } from 'express';
import { db } from '../db/database';
import { createSession } from '../../domain/session';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await db.get('SELECT * FROM users WHERE username = ?', username);

  if (user && await bcrypt.compare(password, user.password)) {
    const session = createSession(user.id);
    res.cookie('sessionId', session.id, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).send({ message: 'Logged in' });
  } else {
    res.status(401).send({ error: 'Invalid credentials' });
  }
});

export default router;

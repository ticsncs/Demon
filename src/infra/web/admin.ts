import { Router } from 'express';
import { db } from '../db/database';
import { getSession } from '../../domain/session';

const router = Router();

router.use((req, res, next) => {
  const sessionId = req.cookies.sessionId;
  const session = getSession(sessionId);

  if (session) {
    next();
  } else {
    res.status(401).send({ error: 'Unauthorized' });
  }
});

router.get('/services', async (_req, res) => {
  const services = await db.all('SELECT * FROM services');
  res.json(services);
});

router.post('/services', async (req, res) => {
  const { name, url, token } = req.body;
  if (!name || !url || !token) {
    return res.status(400).json({ error: 'Name, url and token are required' });
  }

  try {
    await db.run('INSERT INTO services (name, url, token) VALUES (?, ?, ?)', name, url, token);
    res.status(201).json({ message: 'Service added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add service' });
  }
});

router.delete('/services/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(4.0).json({ error: 'Id is required' });
  }

  try {
    await db.run('DELETE FROM services WHERE id = ?', id);
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});


export default router;

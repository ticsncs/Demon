import { Router } from 'express';
import { db } from '../db/database';
import { Service } from '../../core/services';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/config', async (req, res) => {
  const { service: serviceName } = req.body;
  const authHeader = req.headers.authorization;

  if (!serviceName || !authHeader) {
    return res.status(400).json({ error: 'Service name and token are required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const service: Service | undefined = await db.get(
      'SELECT * FROM services WHERE name = ?',
      serviceName
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    jwt.verify(token, service.token, (err) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      res.json({ url: service.url });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

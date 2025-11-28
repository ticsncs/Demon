

import { Router } from 'express';
import { db } from '../db/database';
import { Service } from '../../core/services';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const router = Router();

// Listar todos los servicios
router.get('/services', async (_req, res) => {
  try {
    const services = await db.all('SELECT id, name, url FROM services');
    res.json(services);
  } catch (err) {
    console.error('[API] Error al listar servicios:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Listar todos los servicios
router.get('/services', async (_req, res) => {
  try {
    const services = await db.all('SELECT id, name, url FROM services');
    res.json(services);
  } catch (err) {
    console.error('[API] Error al listar servicios:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/services', async (req, res) => {
  const { name, url } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: 'Name and url are required' });
  }
  try {
    // Generar token seguro
    const token = crypto.randomBytes(32).toString('hex');
    // Guardar en la base de datos
    await db.run('INSERT INTO services (name, url, token) VALUES (?, ?, ?)', name, url, token);
    res.status(201).json({ name, url, token });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Service name already exists' });
    }
    console.error('[API] Error al crear servicio:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


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

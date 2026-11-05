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
        
        // CAMBIO CRÍTICO: Configurar cookie correctamente para proxy
        res.cookie('sessionId', session.id, {
          httpOnly: true,
          sameSite: 'lax',  // Cambiar de 'strict' a 'lax'
          secure: false,    // Nginx maneja el SSL, no la app
          path: '/'         // Asegurar que la cookie funciona en todas las rutas
        });
        
        res.status(200).json({ 
          message: 'Logged in',
          redirect: '/admin'  // Indicar al frontend donde redirigir
        });
        return;
      }
    }
    
    console.log('[LOGIN] Credenciales inválidas');
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    console.error('[LOGIN] Error en login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;

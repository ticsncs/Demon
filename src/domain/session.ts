import crypto from 'crypto';

interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
}

const sessions: Session[] = [];

export function createSession(userId: number): Session {
  const session: Session = {
    id: crypto.randomBytes(16).toString('hex'),
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
  };

  sessions.push(session);

  return session;
}

export function getSession(sessionId: string): Session | undefined {
  return sessions.find(session => session.id === sessionId && session.expiresAt > new Date());
}

export function removeSession(sessionId: string) {
  const index = sessions.findIndex(session => session.id === sessionId);
  if (index !== -1) {
    sessions.splice(index, 1);
  }
}

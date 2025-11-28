import { db } from './database';
import { Service } from '../../core/services';

export async function getServices(): Promise<Service[]> {
  return db.all('SELECT * FROM services');
}

export async function addService(service: Service): Promise<void> {
  await db.run('INSERT INTO services (name, url, token) VALUES (?, ?, ?)', [
    service.name,
    service.url,
    service.token
  ]);
}

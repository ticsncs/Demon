import { initializeDatabase } from '../src/infra/db/database';
import bcrypt from 'bcrypt';

async function addUser() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.error('Usage: ts-node scripts/addUser.ts <username> <password>');
    process.exit(1);
  }

  try {
    const db = await initializeDatabase();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, hashedPassword);
    console.log(`User ${username} created successfully`);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    process.exit();
  }
}

addUser();

import pg from 'pg';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env.js';

const { Client } = pg;

async function runSeed() {
  console.log('Iniciando proceso de seed...');

  const client = new Client({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
  });

  try {
    await client.connect();

    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [env.ADMIN_EMAIL]
    );

    if (existingUser.rowCount && existingUser.rowCount > 0) {
      console.log('Administrador ya existente');
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, saltRounds);

    await client.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)`,
      ['Administrator', env.ADMIN_EMAIL, hashedPassword, 'ADMIN']
    );

    console.log(`Administrador inicial (${env.ADMIN_EMAIL}) creado exitosamente con contraseña hasheada.`);
  } catch (error) {
    console.error('Error al ejecutar el seed del administrador:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeed();

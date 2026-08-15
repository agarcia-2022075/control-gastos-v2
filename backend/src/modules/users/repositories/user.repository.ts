import { pool } from '../../../config/database.js';
import { User, UserResponse } from '../models/user.model.js';

export class UserRepository {
  async findAll(): Promise<UserResponse[]> {
    const query = `
      SELECT 
        id, 
        name, 
        email, 
        role, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM users
      ORDER BY id ASC
    `;
    const result = await pool.query<UserResponse>(query);
    return result.rows;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT 
        id, 
        name, 
        email, 
        password,
        role, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM users
      WHERE email = $1
    `;
    const result = await pool.query<User>(query, [email]);
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<UserResponse | null> {
    const query = `
      SELECT 
        id, 
        name, 
        email, 
        role, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query<UserResponse>(query, [id]);
    return result.rows[0] || null;
  }
}

export const userRepository = new UserRepository();

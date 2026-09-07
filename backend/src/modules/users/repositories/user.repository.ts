import { pool } from '../../../config/database.js';
import { User, UserResponse, UserRole } from '../models/user.model.js';

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

  async create(data: { name: string; email: string; passwordHash: string; role?: UserRole }): Promise<UserResponse> {
    const role = data.role || 'USER';
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING 
        id, 
        name, 
        email, 
        role, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
    `;
    const result = await pool.query<UserResponse>(query, [data.name, data.email, data.passwordHash, role]);
    return result.rows[0];
  }

  async updateRole(id: number, role: UserRole): Promise<UserResponse | null> {
    const query = `
      UPDATE users
      SET role = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING 
        id, 
        name, 
        email, 
        role, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
    `;
    const result = await pool.query<UserResponse>(query, [role, id]);
    return result.rows[0] || null;
  }

  async countAdmins(): Promise<number> {
    const query = `SELECT COUNT(*)::int AS count FROM users WHERE role = 'ADMIN'`;
    const result = await pool.query<{ count: number }>(query);
    return result.rows[0].count;
  }
}

export const userRepository = new UserRepository();

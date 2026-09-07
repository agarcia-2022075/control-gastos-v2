import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { AppError } from '../../../middlewares/error.middleware.js';
import { userRepository, UserRepository } from '../../users/repositories/user.repository.js';
import { UserResponse } from '../../users/models/user.model.js';
import { RegisterRequest, LoginRequest, AuthResponse } from '../models/auth.model.js';

export class AuthService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async register(data: RegisterRequest): Promise<UserResponse> {
    const { name, email, password } = data;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new AppError(400, 'El nombre es obligatorio');
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new AppError(400, 'El correo electrónico no es válido');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new AppError(400, 'La contraseña debe tener al menos 6 caracteres');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.userRepo.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new AppError(409, 'El correo electrónico ya está registrado');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Strictly enforce USER role for public registration
    const newUser = await this.userRepo.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'USER'
    });

    return newUser;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const { email, password } = data;

    if (!email || !password) {
      throw new AppError(400, 'El correo electrónico y la contraseña son obligatorios');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.userRepo.findByEmail(normalizedEmail);
    if (!user || !user.password) {
      throw new AppError(401, 'Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Credenciales inválidas');
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return {
      token,
      user: userResponse
    };
  }

  async getCurrentUser(userId: number): Promise<UserResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(404, 'Usuario no encontrado');
    }
    return user;
  }
}

export const authService = new AuthService();

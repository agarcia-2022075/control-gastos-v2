import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../modules/users/models/user.model.js';
import { userRepository } from '../modules/users/repositories/user.repository.js';
import { AppError } from './error.middleware.js';

export const authorizeRole = (...allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new AppError(401, 'Token de autenticación requerido'));
      }

      // Query PostgreSQL in real-time to obtain latest user role
      const currentUser = await userRepository.findById(req.user.id);
      if (!currentUser) {
        return next(new AppError(404, 'Usuario no encontrado'));
      }

      if (!allowedRoles.includes(currentUser.role)) {
        return next(new AppError(403, 'No tienes permisos para realizar esta acción'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

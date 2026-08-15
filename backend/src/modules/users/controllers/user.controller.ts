import { Request, Response, NextFunction } from 'express';
import { userService, UserService } from '../services/user.service.js';

export class UserController {
  constructor(private userSvc: UserService = userService) {}

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userSvc.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();

import { userRepository, UserRepository } from '../repositories/user.repository.js';
import { UserResponse } from '../models/user.model.js';

export class UserService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async getAllUsers(): Promise<UserResponse[]> {
    return await this.userRepo.findAll();
  }

  async getUserById(id: number): Promise<UserResponse | null> {
    return await this.userRepo.findById(id);
  }
}

export const userService = new UserService();

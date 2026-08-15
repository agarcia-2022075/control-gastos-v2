export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserResponse = Omit<User, 'password'>;

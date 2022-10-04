import { Group } from './group.interface';

export type UserRole = 'student' | 'admin';
export interface User {
  id: string;
  login: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserStudent extends User {
  group: Group;
  role: 'student';
  password?: string;
}

export interface UserCreate extends User {
  password: string;
  group: Group | undefined;
}

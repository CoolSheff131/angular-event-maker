import { Group } from './group.interface';

export type UserRole = {
  id: string;
  name: string;
};
export interface User {
  id: string;
  login: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserStudent extends User {
  group: Group;

  password?: string;
}

export interface UserCreate extends User {
  password: string;
  group: Group | undefined;
}

import { Group } from './group.interface';

export interface User {
  id: string;
  name: string;
  email: string;
  group: Group;
}

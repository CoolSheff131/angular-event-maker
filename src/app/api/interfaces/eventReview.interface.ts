import { User } from './user.interface';

export interface EventReview {
  id: string;
  reviewer: User;
  text: string;
  images?: string[];
}

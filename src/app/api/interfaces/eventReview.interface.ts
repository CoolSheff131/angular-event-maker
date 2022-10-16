import { Event } from './event.interface';
import { User } from './user.interface';

export interface EventReview {
  id: string;
  rate: number;
  reviewer: User;
  text: string;
  event: Event;
  images?: string[];
}

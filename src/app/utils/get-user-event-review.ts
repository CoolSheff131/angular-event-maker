import { Event } from '../api/interfaces/event.interface';
import { User } from '../api/interfaces/user.interface';

export function findUserEventReview(user: User, event: Event) {
  return event.reviews.find((review) => review.reviewer.id === user.id);
}

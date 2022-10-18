import { Event } from '../api/interfaces/event.interface';
import { User } from '../api/interfaces/user.interface';
import { isEventEnded } from './is-event-ended';
import { isUserCameToEvent } from './is-user-came-to-event';

export function canUserWriteEventReview(user: User, event: Event) {
  return isEventEnded(event) && isUserCameToEvent(event, user);
}

import { Event } from '../api/interfaces/event.interface';
import { User } from '../api/interfaces/user.interface';

export function isUserCameToEvent(event: Event, user: User) {
  return event.peopleCame.some((u) => u.id === user.id);
}

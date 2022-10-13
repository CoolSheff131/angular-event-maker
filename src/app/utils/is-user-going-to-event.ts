import { Event } from '../api/interfaces/event.interface';
import { User } from '../api/interfaces/user.interface';

export function IsUserGoingToEvent(user: User, event: Event): boolean {
  return event.peopleWillCome.some((u) => u.id === user.id);
}

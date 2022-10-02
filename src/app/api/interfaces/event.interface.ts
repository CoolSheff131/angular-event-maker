import { EventDay } from './eventDay.interface';
import { EventReview } from './eventReview.interface';
import { EventTag } from './eventTag.interface';
import { Group } from './group.interface';
import { User } from './user.interface';

export interface Event {
  id: string;
  title: string;
  description: string;
  owner: User;
  places: number;

  groups: Group[];
  tags: EventTag[];
  images: string[];
  days: EventDay[];
  peopleWillCome?: User[];
  peopleCame?: User[];
  reviews?: EventReview[];
}

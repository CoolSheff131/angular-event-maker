import { EventDay } from './eventDay.interface';
import { EventTag } from './eventTag.interface';
import { Group } from './group.interface';

export interface Event {
  id: string;
  title: string;
  description: string;
  places: number;
  groups: Group[];
  tags: EventTag[];
  images: string[];
  dateStart: Date;
  dateEnd: Date;
  days: EventDay[];
}

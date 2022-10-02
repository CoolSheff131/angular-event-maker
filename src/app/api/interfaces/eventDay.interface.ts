import { Auditory } from './auditory.interface';

export interface EventDay {
  id: string;
  day: Date;
  timeStart: string;
  auditory: Auditory;
}

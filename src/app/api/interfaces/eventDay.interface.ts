import { Auditory } from './auditory.interface';

export interface EventDay {
  id: string;
  timeStart: Date;
  auditory: Auditory;
}

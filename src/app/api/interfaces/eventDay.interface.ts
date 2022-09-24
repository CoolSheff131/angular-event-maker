import { Auditory } from './auditory.interface';

export interface EventDay {
  id: string;
  timeStart: string;
  auditory: Auditory;
}

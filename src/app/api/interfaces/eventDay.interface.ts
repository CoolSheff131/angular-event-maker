import { Auditory } from './auditory.interface';

export interface EventDay {
  id: string;
  date: Date;
  auditory: Auditory;
}

import { Event } from '../api/interfaces/event.interface';

/**
 * Check is event ended
 * @param event event to check
 * @returns is event ended
 */
export function isEventEnded(event: Event): boolean {
  const dates = event.days.map((d) => d.date);
  const today = new Date();
  return dates.every((d) => d < today);
}

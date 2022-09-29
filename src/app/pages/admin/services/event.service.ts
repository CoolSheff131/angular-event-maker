import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { ApiService } from '../../../api/api.service';
import { Event } from '../../../api/interfaces/event.interface';

@Injectable({ providedIn: 'root' })
export class EventService {
  private events = new Subject<Event[]>();

  events$ = this.events.asObservable();
  constructor(private readonly apiService: ApiService) {}

  createEvent(value: string) {
    this.apiService
      .createEvent(value)
      .pipe(tap(() => this.getEvents()))
      .subscribe();
  }

  getEvents() {
    this.apiService.getEvents().subscribe({
      next: (events) => {
        this.events.next(events);
      },
    });
  }
}

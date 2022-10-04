import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { EventDay } from 'src/app/api/interfaces/eventDay.interface';
import { Group } from 'src/app/api/interfaces/group.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { ApiService } from '../../../api/api.service';
import { Event } from '../../../api/interfaces/event.interface';

@Injectable({ providedIn: 'root' })
export class EventService {
  deleteEvent(event: Event) {
    this.apiService
      .deleteEvent(event.id)
      .pipe(tap(() => this.getEvents()))
      .subscribe();
  }
  private events = new Subject<Event[]>();

  events$ = this.events.asObservable();
  constructor(private readonly apiService: ApiService) {
    this.getEvents();
  }

  createEvent(
    images: FileList,
    title: string,
    description: string,
    owner: User,
    places: number,
    groups: Group[],
    days: EventDay[]
  ) {
    this.apiService
      .createEvent(
        Array.from(images),
        title,
        description,
        owner,
        places,
        groups,
        days
      )
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

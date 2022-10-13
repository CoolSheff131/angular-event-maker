import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { EventDay } from 'src/app/api/interfaces/eventDay.interface';
import { EventTag } from 'src/app/api/interfaces/eventTag.interface';
import { Group } from 'src/app/api/interfaces/group.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { ApiService } from '../../../api/api.service';
import { Event } from '../../../api/interfaces/event.interface';
import { EventsComponent } from '../../user/events/events.component';

@Injectable({ providedIn: 'root' })
export class EventService {
  private events = new BehaviorSubject<Event[]>([]);

  events$ = this.events.asObservable();

  notGoingToEvent(event: Event, user: User) {
    return this.apiService
      .notGoingToEvent(event, user)
      .pipe(tap(() => this.getEvents()));
  }

  goingToEvent(event: Event, user: User) {
    this.apiService
      .goingToEvent(event, user)
      .pipe(tap(() => this.getEvents()))
      .subscribe();
  }

  getUserEvent(user: User) {
    return this.apiService.getUserEvents(user);
  }

  constructor(private readonly apiService: ApiService) {
    this.getEvents();
  }

  updateEvent(
    idEditing: string,
    images: File[] | null,
    title: string,
    description: string,
    owner: User,
    places: number,
    groups: Group[],
    days: EventDay[],
    tags: EventTag[]
  ) {
    this.apiService
      .updateEvent(
        idEditing,
        {
          id: idEditing,
          days,
          groups,
          places,
          owner,
          images: [],
          tags,
          description,
          title,
        },
        images
      )
      .pipe(tap(() => this.getEvents()))
      .subscribe();
  }

  deleteEvent(event: Event) {
    this.apiService
      .deleteEvent(event.id)
      .pipe(tap(() => this.getEvents()))
      .subscribe();
  }

  createEvent(
    images: File[],
    title: string,
    description: string,
    owner: User,
    places: number,
    groups: Group[],
    days: EventDay[],
    tags: EventTag[]
  ) {
    this.apiService
      .createEvent(
        images,
        title,
        description,
        owner,
        places,
        groups,
        days,
        tags
      )
      .pipe(tap(() => this.getEvents()))
      .subscribe();
  }

  getEvents() {
    this.apiService.getEvents().subscribe({
      next: (events) => {
        this.events.next(events);
        console.log(events);
      },
    });
  }
}

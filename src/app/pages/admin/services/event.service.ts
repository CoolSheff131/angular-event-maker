import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { EventDay } from 'src/app/api/interfaces/eventDay.interface';
import { EventTag } from 'src/app/api/interfaces/eventTag.interface';
import { Group } from 'src/app/api/interfaces/group.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { ApiService } from '../../../api/api.service';
import { Event } from '../../../api/interfaces/event.interface';

@Injectable({ providedIn: 'root' })
export class EventService {
  private events = new BehaviorSubject<Event[]>([]);

  events$ = this.events.asObservable();

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

  goingToEvent(event: Event, user: any) {
    this.apiService
      .goingToEvent(event, user)
      .pipe(tap(() => this.getEvents()))
      .subscribe();
  }

  deleteEvent(event: Event) {
    this.apiService
      .deleteEvent(event.id)
      .pipe(tap(() => this.getEvents()))
      .subscribe();
  }

  constructor(private readonly apiService: ApiService) {
    this.getEvents();
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

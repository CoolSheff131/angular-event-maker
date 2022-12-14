import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { EventDay } from 'src/app/api/interfaces/eventDay.interface';
import { EventTag } from 'src/app/api/interfaces/eventTag.interface';
import { Group } from 'src/app/api/interfaces/group.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { ApiService, ResponceStatus } from '../../../api/api.service';
import { Event } from '../../../api/interfaces/event.interface';
import { EventsComponent } from '../../user/events/events.component';

@Injectable({ providedIn: 'root' })
export class EventService {
  private deleteEventResponce = new BehaviorSubject<ResponceStatus>('none');
  private createEventResponce = new BehaviorSubject<ResponceStatus>('none');
  private updateEventResponce = new BehaviorSubject<ResponceStatus>('none');
  private getAllEventsResponce = new BehaviorSubject<ResponceStatus>('none');

  deleteEventResponce$ = this.deleteEventResponce.asObservable();
  createEventResponce$ = this.createEventResponce.asObservable();
  updateEventResponce$ = this.updateEventResponce.asObservable();
  getAllEventsResponce$ = this.getAllEventsResponce.asObservable();

  removeConfirmPresent(event: Event, user: User) {
    return this.apiService
      .removeConfirmPresent(event, user)
      .pipe(tap(() => this.getEvents()));
  }
  confirmPresent(event: Event, user: User) {
    return this.apiService
      .confirmPresent(event, user)
      .pipe(tap(() => this.getEvents()));
  }
  getEvent(id: string) {
    return this.apiService.getEvent(id);
  }
  private events = new BehaviorSubject<Event[]>([]);

  events$ = this.events.asObservable();

  notGoingToEvent(event: Event, user: User) {
    return this.apiService
      .notGoingToEvent(event, user)
      .pipe(tap(() => this.getEvents()));
  }

  goingToEvent(event: Event, user: User) {
    return this.apiService
      .goingToEvent(event, user)
      .pipe(tap(() => this.getEvents()));
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
    tags: EventTag[],
    peopleCame: User[],
    peopleWillCome: User[]
  ) {
    this.updateEventResponce.next('pending');
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
          peopleCame,
          peopleWillCome,
        },
        images
      )
      .pipe(tap(() => this.getEvents()))
      .subscribe({
        next: () => {
          this.updateEventResponce.next('success');
        },
        error: () => {
          this.updateEventResponce.next('error');
        },
      });
  }

  deleteEvent(event: Event) {
    this.deleteEventResponce.next('pending');
    this.apiService
      .deleteEvent(event.id)
      .pipe(tap(() => this.getEvents()))
      .subscribe({
        next: () => {
          this.deleteEventResponce.next('success');
        },
        error: () => {
          this.deleteEventResponce.next('error');
        },
      });
  }

  createEvent(
    images: File[],
    title: string,
    description: string,
    owner: User,
    places: number,
    groups: Group[],
    days: EventDay[],
    tags: EventTag[],
    peopleCame: User[],
    peopleWillCome: User[]
  ) {
    this.createEventResponce.next('pending');
    this.apiService
      .createEvent(
        images,
        title,
        description,
        owner,
        places,
        groups,
        days,
        tags,
        peopleCame,
        peopleWillCome
      )
      .pipe(tap(() => this.getEvents()))
      .subscribe({
        next: () => {
          this.createEventResponce.next('success');
        },
        error: () => {
          this.createEventResponce.next('error');
        },
      });
  }

  getEvents() {
    this.getAllEventsResponce.next('pending');
    this.apiService.getEvents().subscribe({
      next: (events) => {
        this.getAllEventsResponce.next('success');

        this.events.next(events);
      },
      error: () => {
        this.getAllEventsResponce.next('error');
      },
    });
  }
}

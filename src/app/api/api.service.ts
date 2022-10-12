import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Auditory } from './interfaces/auditory.interface';
import { AuthData } from './interfaces/auth.interface';
import { Event } from './interfaces/event.interface';
import { EventDay } from './interfaces/eventDay.interface';
import { EventReview } from './interfaces/eventReview.interface';
import { EventTag } from './interfaces/eventTag.interface';
import { Group } from './interfaces/group.interface';
import { User, UserCreate, UserStudent } from './interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  goingToEvent(event: Event, user: any) {
    return this.httpService.patch(
      this.API_URL + `events/goingToEvent/${event.id}`,
      user
    );
  }
  updateEventReview(
    id: string,
    eventReview: Partial<EventReview>,
    images: File[]
  ) {
    const formData = new FormData();
    images.forEach((file) => {
      formData.append('images[]', file);
    });
    formData.append('reviewer', JSON.stringify(eventReview.reviewer));
    formData.append('text', eventReview.text!);
    return this.httpService.patch(
      this.API_URL + `event-reviews/${id}`,
      formData
    );
  }

  deleteEventReview(id: string) {
    return this.httpService.delete(this.API_URL + `event-reviews/${id}`);
  }

  updateEvent(id: string, event: Partial<Event>, images: File[] | null) {
    const formData = new FormData();
    if (images !== null) {
      images.forEach((file) => {
        formData.append('images[]', file);
      });
    }

    Object.entries(event).forEach(([key, value]) => {
      if (value) {
        formData.append(key, JSON.stringify(value));
      }
    });

    return this.httpService.patch(this.API_URL + `events/${id}`, formData);
  }
  updateAuditory(auditoryToEditId: string, auditory: Partial<Auditory>) {
    return this.httpService.patch(
      this.API_URL + `auditories/${auditoryToEditId}`,
      auditory
    );
  }
  deleteAuditory(id: string) {
    return this.httpService.delete(this.API_URL + `auditories/${id}`);
  }
  deleteEvent(id: string) {
    return this.httpService.delete(this.API_URL + `events/${id}`);
  }
  deleteUser(id: string) {
    return this.httpService.delete(this.API_URL + `users/${id}`);
  }
  updateUserStudent(id: string, userStudent: Partial<UserStudent>) {
    return this.httpService.patch(this.API_URL + `users/${id}`, {
      ...userStudent,
    });
  }
  updateEventTag(id: string, eventTag: Partial<EventTag>) {
    return this.httpService.patch(this.API_URL + `event-tags/${id}`, {
      ...eventTag,
    });
  }
  deleteEventTag(id: string) {
    return this.httpService.delete(this.API_URL + `event-tags/${id}`);
  }
  updateGroup(id: string, group: Partial<Group>) {
    return this.httpService.patch(this.API_URL + `groups/${id}`, {
      ...group,
    });
  }
  private readonly API_URL = 'http://localhost:3000/';

  constructor(private httpService: HttpClient) {}

  private get token() {
    return localStorage.getItem('token') || null;
  }

  private set token(token: string | null) {
    if (!token) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', token);
    }
  }

  tryAuthOnStart(): Observable<User | undefined> {
    if (!this.token) {
      return of(undefined);
    }
    return this.httpService.get<User>(this.API_URL + 'auth/user', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  unauthorize() {
    this.token = null;
  }

  login(login: string, password: string) {
    return this.httpService
      .post<AuthData>(this.API_URL + 'auth/login', {
        login,
        password,
      })
      .pipe(
        map((authData) => {
          this.token = authData.accessToken;
          return authData.userData;
        })
      );
  }
  register(
    login: string,
    group: Group,
    name: string,
    email: string,
    password: string
  ) {
    return this.httpService
      .post<AuthData>(this.API_URL + 'auth/register', {
        login,
        group,
        name,
        email,
        password,
      })
      .pipe(
        map((authData) => {
          this.token = authData.accessToken;
          return authData.userData;
        })
      );
  }

  getEvents() {
    return this.httpService.get<Event[]>(this.API_URL + 'events');
  }
  getAuditories() {
    return this.httpService.get<Auditory[]>(this.API_URL + 'auditories');
  }

  getEventTags() {
    return this.httpService.get<EventTag[]>(this.API_URL + 'event-tags');
  }

  getGroups() {
    return this.httpService.get<Group[]>(this.API_URL + 'groups');
  }

  deleteGroup(id: string) {
    return this.httpService.delete(this.API_URL + `groups/${id}`);
  }

  getEventReviews() {
    return this.httpService.get<EventReview[]>(this.API_URL + 'event-reviews');
  }

  getUsers() {
    return this.httpService.get<UserStudent[]>(this.API_URL + 'users');
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
    const formData = new FormData();
    images.forEach((file) => {
      formData.append('images[]', file);
    });
    formData.append('title', title);
    formData.append('description', description);
    formData.append('owner', JSON.stringify(owner));
    formData.append('places', JSON.stringify(places));
    formData.append('groups', JSON.stringify(groups));
    formData.append('days', JSON.stringify(days));
    formData.append('tags', JSON.stringify(tags));

    return this.httpService.post<Event>(this.API_URL + 'events', formData);
  }
  createAuditory(auditory: Auditory) {
    console.log(auditory);
    return this.httpService.post<Auditory>(this.API_URL + 'auditories', {
      ...auditory,
    });
  }

  createEventTag(eventTag: EventTag) {
    return this.httpService.post<EventTag>(this.API_URL + 'event-tags', {
      ...eventTag,
    });
  }

  createGroup(group: Group) {
    return this.httpService.post<Group>(this.API_URL + 'groups', {
      ...group,
    });
  }

  createEventReview(eventReview: any) {
    return this.httpService.post<EventReview>(this.API_URL + 'event-reviews', {
      ...eventReview,
    });
  }

  createUserStudent(user: UserCreate) {
    return this.httpService.post<User>(this.API_URL + 'users', { ...user });
  }
}

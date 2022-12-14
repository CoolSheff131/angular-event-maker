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
import {
  User,
  UserCreate,
  UserRole,
  UserStudent,
} from './interfaces/user.interface';

export type ResponceStatus = 'pending' | 'success' | 'error' | 'none';

@Injectable({ providedIn: 'root' })
export class ApiService {
  deleteUserRole(userRole: UserRole) {
    return this.httpService.delete(this.API_URL + `user-roles/${userRole.id}`);
  }
  updateUserRole(userRoleIdEdit: string, newName: string) {
    return this.httpService.patch(
      this.API_URL + `user-roles/${userRoleIdEdit}`,
      {
        name: newName,
      }
    );
  }
  createUserRole(name: string) {
    return this.httpService.post(this.API_URL + `user-roles`, { name });
  }
  getUserRoles() {
    return this.httpService.get<UserRole[]>(this.API_URL + 'user-roles');
  }
  removeConfirmPresent(event: Event, user: User) {
    return this.httpService.patch<Event>(
      this.API_URL + `events/${event.id}/remove-confirm-present`,
      user
    );
  }
  confirmPresent(event: Event, user: User) {
    return this.httpService.patch<Event>(
      this.API_URL + `events/${event.id}/confirm-present`,
      user
    );
  }
  getEvent(id: string) {
    return this.httpService.get<Event>(this.API_URL + `events/${id}`);
  }
  getUserEvents(user: User) {
    return this.httpService.get<Event[]>(
      this.API_URL + `events/userEvents/${user.id}`
    );
  }
  notGoingToEvent(event: Event, user: User) {
    return this.httpService.patch(
      this.API_URL + `events/notGoingToEvent/${event.id}`,
      user
    );
  }
  goingToEvent(event: Event, user: User) {
    return this.httpService.patch(
      this.API_URL + `events/goingToEvent/${event.id}`,
      user
    );
  }

  updateEventReview(
    id: string,
    eventReview: Partial<EventReview>,
    images: File[] | null
  ) {
    const formData = new FormData();
    if (images) {
      images.forEach((file) => {
        formData.append('images[]', file);
      });
    }
    formData.append('reviewer', JSON.stringify(eventReview.reviewer));
    formData.append('text', eventReview.text!);
    formData.append('rate', JSON.stringify(eventReview.rate));
    formData.append('event', JSON.stringify(eventReview.event));
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
  updateUser(id: string, userStudent: Partial<UserStudent>) {
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
    tags: EventTag[],
    peopleCame: User[],
    peopleWillCome: User[]
  ) {
    const formData = new FormData();
    images.forEach((file) => {
      formData.append('images[]', file);
    });
    formData.append('title', JSON.stringify(title));
    formData.append('description', JSON.stringify(description));
    formData.append('owner', JSON.stringify(owner));
    formData.append('places', JSON.stringify(places));
    formData.append('groups', JSON.stringify(groups));
    formData.append('days', JSON.stringify(days));
    formData.append('tags', JSON.stringify(tags));
    formData.append('peopleCame', JSON.stringify(peopleCame));
    formData.append('peopleWillCome', JSON.stringify(peopleWillCome));

    return this.httpService.post<Event>(this.API_URL + 'events', formData);
  }
  createAuditory(auditory: Auditory) {
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

  createEventReview(
    images: File[] | null,
    rate: number,
    text: string,
    reviewer: User,
    event: Event
  ) {
    const formData = new FormData();
    if (images) {
      images.forEach((file) => {
        formData.append('images[]', file);
      });
    }
    formData.append('text', text);
    formData.append('reviewer', JSON.stringify(reviewer));
    formData.append('rate', JSON.stringify(rate));
    formData.append('event', JSON.stringify(event));

    return this.httpService.post<EventReview>(
      this.API_URL + 'event-reviews',
      formData
    );
  }

  createUser(user: UserCreate) {
    return this.httpService.post<User>(this.API_URL + 'users', { ...user });
  }
}

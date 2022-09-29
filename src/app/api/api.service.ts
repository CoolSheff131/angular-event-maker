import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Auditory } from './interfaces/auditory.interface';
import { AuthData } from './interfaces/auth.interface';
import { EventReview } from './interfaces/eventReview.interface';
import { EventTag } from './interfaces/eventTag.interface';
import { Group } from './interfaces/group.interface';
import { User } from './interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
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
  register(login: string, name: string, email: string, password: string) {
    return this.httpService
      .post<AuthData>(this.API_URL + 'auth/register', {
        login,
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
    return this.httpService.get<Auditory[]>(this.API_URL + 'events');
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

  getEventReviews() {
    return this.httpService.get<EventReview[]>(this.API_URL + 'event-reviews');
  }

  getUsers() {
    return this.httpService.get<User[]>(this.API_URL + 'users');
  }

  createEvent() {
    return this.httpService.post<Auditory>(this.API_URL + 'events', {});
  }
  createAuditory(auditoryName: string) {
    console.log(auditoryName);
    return this.httpService.post<Auditory>(this.API_URL + 'auditories', {
      auditoryName,
    });
  }

  createEventTag(eventTagName: string) {
    return this.httpService.post<EventTag>(this.API_URL + 'event-tags', {
      eventTagName,
    });
  }

  createGroup(groupName: string) {
    return this.httpService.post<Group>(this.API_URL + 'groups', {
      groupName,
    });
  }

  createEventReview() {
    return this.httpService.post<EventReview>(
      this.API_URL + 'event-reviews',
      {}
    );
  }

  createUser() {
    return this.httpService.post<User>(this.API_URL + 'users', {});
  }
}

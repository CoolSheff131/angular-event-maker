import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { AuthData } from './interfaces/auth.interface';
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
}

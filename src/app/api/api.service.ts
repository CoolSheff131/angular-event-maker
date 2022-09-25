import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly API_URL = 'http://localhost:3000/';

  constructor(private httpService: HttpClient) {}

  login(login: string, password: string) {
    return this.httpService.post(this.API_URL + 'auth/login', {
      login,
      password,
    });
  }
  register(login: string, name: string, email: string, password: string) {
    return this.httpService.post(this.API_URL + 'auth/register', {
      login,
      name,
      email,
      password,
    });
  }
}

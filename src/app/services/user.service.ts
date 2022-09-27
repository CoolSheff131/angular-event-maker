import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { User } from '../api/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private authedUser = new Subject<User | undefined>();

  authedUser$ = this.authedUser.asObservable();

  private loginStatus = new Subject<'success' | 'error' | 'pending'>();

  loginStatus$ = this.loginStatus.asObservable();

  constructor(private readonly apiService: ApiService) {
    apiService.tryAuthOnStart().subscribe({
      next: (user) => {
        this.authedUser.next(user);
      },
      error: (err) => {
        this.unauthorizeUser();
      },
    });
  }

  unauthorizeUser() {
    this.apiService.unauthorize();
    this.authedUser.next(undefined);
  }

  login(login: string, password: string) {
    this.loginStatus.next('pending');

    this.apiService.login(login, password).subscribe({
      next: (user) => {
        this.loginStatus.next('success');
        this.authedUser.next(user);
      },
      error: (user) => {
        this.loginStatus.next('error');
      },
    });
  }

  register(login: string, name: string, email: string, password: string) {
    this.loginStatus.next('pending');

    this.apiService.register(login, name, email, password).subscribe({
      next: (authData) => {
        this.authedUser.next(authData);
        this.loginStatus.next('success');
      },
      error: (err) => {
        this.loginStatus.next('error');
      },
    });
  }
}

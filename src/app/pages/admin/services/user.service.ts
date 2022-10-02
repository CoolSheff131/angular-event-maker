import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Group } from 'src/app/api/interfaces/group.interface';
import { ApiService } from '../../../api/api.service';
import {
  User,
  UserRole,
  UserStudent,
} from '../../../api/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  deleteUser(user: User) {
    this.apiService
      .deleteUser(user.id)
      .pipe(tap(() => this.getAllUsers()))
      .subscribe();
  }
  updateUserStudent(
    id: string,
    login: string,
    userName: string,
    email: string,
    group: Group
  ) {
    this.apiService
      .updateUserStudent(id, {
        login,
        email: email,
        name: userName,
        group: group,
      })
      .pipe(tap(() => this.getAllUsers()))
      .subscribe();
  }
  createUserStudent(
    userPasword: string,
    login: string,
    userName: string,
    email: string,
    group: Group
  ) {
    this.apiService
      .createUserStudent({
        id: '',
        login: login,
        password: userPasword,
        name: userName,
        email: email,
        group: group,
        role: 'student',
      })
      .pipe(tap(() => this.getAllUsers()))
      .subscribe();
  }
  private allStudents = new Subject<UserStudent[]>();

  allStudents$ = this.allStudents.asObservable();

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
    this.getAllUsers();
  }

  getAllUsers() {
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.allStudents.next(users);
      },
    });
  }

  unauthorizeUser() {
    console.log('asd');
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

  register(
    login: string,
    group: Group,
    name: string,
    email: string,
    password: string
  ) {
    this.loginStatus.next('pending');

    this.apiService.register(login, group, name, email, password).subscribe({
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

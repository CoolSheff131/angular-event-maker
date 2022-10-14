import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Subject, tap } from 'rxjs';
import { Group } from 'src/app/api/interfaces/group.interface';
import { ApiService } from '../../../api/api.service';
import {
  User,
  UserRole,
  UserStudent,
} from '../../../api/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  deleteUserRole(userRole: UserRole) {
    this.apiService.deleteUserRole(userRole).subscribe(() => {
      this.getAllUserRoles();
    });
  }
  updateUserRole(userRoleIdEdit: string, newName: string) {
    this.apiService.updateUserRole(userRoleIdEdit, newName).subscribe(() => {
      this.getAllUserRoles();
    });
  }
  createUserRole(name: string) {
    this.apiService.createUserRole(name).subscribe(() => {
      this.getAllUserRoles();
    });
  }

  private allStudents = new BehaviorSubject<UserStudent[]>([]);
  private authedUser = new BehaviorSubject<User | undefined>(undefined);
  private loginStatus = new Subject<
    'waiting' | 'success' | 'error' | 'pending'
  >();
  private userRoles = new BehaviorSubject<UserRole[]>([]);

  allStudents$ = this.allStudents.asObservable();
  authedUser$ = this.authedUser.asObservable().pipe(filter(Boolean));
  loginStatus$ = this.loginStatus.asObservable();
  userRoles$ = this.userRoles.asObservable();

  constructor(private readonly apiService: ApiService) {
    apiService.tryAuthOnStart().subscribe({
      next: (user) => {
        this.authedUser.next(user);
      },
      error: (err) => {
        this.unauthorizeUser();
      },
    });

    this.getAllUserRoles();
    this.getAllUsers();
  }

  getAllUserRoles() {
    this.apiService.getUserRoles().subscribe({
      next: (userRoles) => {
        this.userRoles.next(userRoles);
      },
    });
  }

  getAllUsers() {
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.allStudents.next(users);
      },
    });
  }

  unauthorizeUser() {
    this.apiService.unauthorize();
    this.authedUser.next(undefined);
  }

  deleteUser(user: User) {
    this.apiService
      .deleteUser(user.id)
      .pipe(tap(() => this.getAllUsers()))
      .subscribe();
  }

  updateUser(
    id: string,
    login: string,
    password: string,
    userName: string,
    email: string,
    group: Group,
    role: UserRole
  ) {
    this.apiService
      .updateUser(id, {
        login,
        password,
        email: email,
        name: userName,
        group: group,
        role,
      })
      .pipe(tap(() => this.getAllUsers()))
      .subscribe();
  }

  createUser(
    userPasword: string,
    login: string,
    userName: string,
    email: string,
    group: Group,
    role: UserRole
  ) {
    this.apiService
      .createUser({
        id: '',
        login: login,
        password: userPasword,
        name: userName,
        email: email,
        group: group,
        role,
      })
      .pipe(tap(() => this.getAllUsers()))
      .subscribe();
  }

  login(login: string, password: string) {
    this.loginStatus.next('pending');

    this.apiService.login(login, password).subscribe({
      next: (user) => {
        this.loginStatus.next('success');
        this.authedUser.next(user);
      },
      error: () => {
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

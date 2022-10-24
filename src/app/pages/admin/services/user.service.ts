import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Subject, tap } from 'rxjs';
import { Group } from 'src/app/api/interfaces/group.interface';
import { ApiService, ResponceStatus } from '../../../api/api.service';
import {
  User,
  UserRole,
  UserStudent,
} from '../../../api/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private deleteUserRoleResponce = new Subject<ResponceStatus>();
  private createUserRoleResponce = new Subject<ResponceStatus>();
  private updateUserRolesResponce = new Subject<ResponceStatus>();
  private getAllUserRolesResponce = new Subject<ResponceStatus>();
  deleteUserRoleResponce$ = this.deleteUserRoleResponce.asObservable();
  createUserRoleResponce$ = this.createUserRoleResponce.asObservable();
  getAllUserRolesResponce$ = this.getAllUserRolesResponce.asObservable();
  updateUserRolesResponce$ = this.updateUserRolesResponce.asObservable();

  private deleteUserResponce = new Subject<ResponceStatus>();
  private createUserResponce = new Subject<ResponceStatus>();
  private updateUserResponce = new Subject<ResponceStatus>();
  private getAllUsersResponce = new Subject<ResponceStatus>();
  deleteUserResponce$ = this.deleteUserResponce.asObservable();
  createUserResponce$ = this.createUserResponce.asObservable();
  getAllUsersResponce$ = this.getAllUsersResponce.asObservable();
  updateUserResponce$ = this.updateUserResponce.asObservable();

  private allStudents = new BehaviorSubject<UserStudent[]>([]);
  private authedUser = new BehaviorSubject<User | undefined>(undefined);
  private loginStatus = new Subject<ResponceStatus>();
  private userRoles = new BehaviorSubject<UserRole[]>([]);

  allUsers$ = this.allStudents.asObservable();
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
    this.getAllUserRolesResponce.next('pending');
    this.apiService.getUserRoles().subscribe({
      next: (userRoles) => {
        this.userRoles.next(userRoles);
        this.getAllUserRolesResponce.next('success');
      },
      error: () => {
        this.getAllUserRolesResponce.next('error');
      },
    });
  }

  deleteUserRole(userRole: UserRole) {
    this.deleteUserRoleResponce.next('pending');

    this.apiService.deleteUserRole(userRole).subscribe({
      error: () => {
        this.deleteUserRoleResponce.next('error');
      },
      next: () => {
        this.getAllUserRoles();
        this.deleteUserRoleResponce.next('success');
      },
    });
  }
  updateUserRole(userRoleIdEdit: string, newName: string) {
    this.updateUserRolesResponce.next('pending');
    this.apiService.updateUserRole(userRoleIdEdit, newName).subscribe({
      error: () => {
        this.updateUserRolesResponce.next('error');
      },
      next: () => {
        this.getAllUserRoles();
        this.updateUserRolesResponce.next('success');
      },
    });
  }
  createUserRole(name: string) {
    this.createUserRoleResponce.next('pending');
    this.apiService.createUserRole(name).subscribe({
      error: () => {
        this.createUserRoleResponce.next('error');
      },
      next: () => {
        this.getAllUserRoles();
        this.createUserRoleResponce.next('success');
      },
    });
  }

  getAllUsers() {
    this.getAllUsersResponce.next('pending');
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.allStudents.next(users);
        this.getAllUsersResponce.next('success');
      },
      error: () => {
        this.getAllUsersResponce.next('error');
      },
    });
  }

  deleteUser(user: User) {
    this.deleteUserResponce.next('pending');
    this.apiService
      .deleteUser(user.id)
      .pipe(tap(() => this.getAllUsers()))
      .subscribe({
        next: () => {
          this.deleteUserResponce.next('success');
        },
        error: () => {
          this.deleteUserResponce.next('error');
        },
      });
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
    this.updateUserResponce.next('pending');
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
      .subscribe({
        next: () => {
          this.updateUserResponce.next('success');
        },
        error: () => {
          this.updateUserResponce.next('error');
        },
      });
  }

  createUser(
    userPasword: string,
    login: string,
    userName: string,
    email: string,
    group: Group,
    role: UserRole
  ) {
    this.createUserResponce.next('pending');
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
      .subscribe({
        next: () => {
          this.createUserResponce.next('success');
        },
        error: () => {
          this.createUserResponce.next('error');
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

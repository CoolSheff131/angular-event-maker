import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { distinctUntilChanged, map, merge, skipWhile, take } from 'rxjs';
import { Group } from 'src/app/api/interfaces/group.interface';
import {
  User,
  UserRole,
  UserStudent,
} from 'src/app/api/interfaces/user.interface';
import { UserService } from 'src/app/pages/admin/services/user.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  isFormDialogOpen = false;
  isEditing = false;

  form = new FormGroup({
    userLoginControl: new FormControl<string>('', [Validators.required]),
    userNameControl: new FormControl<string>('', [Validators.required]),
    userEmailControl: new FormControl<string>('', [Validators.required]),
    userGroupControl: new FormControl<Group | null>(null, [
      Validators.required,
    ]),
    userPasswordControl: new FormControl<string>('', [Validators.required]),
    userRoleControl: new FormControl<UserRole | null>(null, [
      Validators.required,
    ]),
  });
  userIdEdit = '';

  users: UserStudent[] = [];
  groups: Group[] = [];
  userRoles: UserRole[] = [];
  deleteUserResponce$ = this.userService.deleteUserResponce$;
  updateUserResponce$ = this.userService.updateUserResponce$;
  createUserResponce$ = this.userService.createUserResponce$;
  getAllUsersResponce$ = this.userService.getAllUsersResponce$;

  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {
    userService.allUsers$.subscribe((users) => {
      this.users = users;
    });
    groupService.groups$.subscribe((groups) => {
      this.groups = groups;
    });
    userService.userRoles$.subscribe((userRoles) => {
      this.userRoles = userRoles;
    });
    groupService.getGroups();

    merge(this.createUserResponce$, this.updateUserResponce$)
      .pipe(
        distinctUntilChanged(),
        map((status) => status === 'pending')
      )
      .subscribe((isDisabled) => {
        if (isDisabled) {
          this.form.disable();
        } else {
          this.form.enable();
        }
      });
  }
  ngOnInit(): void {
    this.userService.getAllUsers();
  }

  addUser() {
    this.initForm();
    this.isEditing = false;
    this.isFormDialogOpen = true;
    this.initForm();
  }

  initForm() {
    this.form.reset();
  }

  closeFormDialog() {
    this.isFormDialogOpen = false;
  }

  editUser(user: UserStudent) {
    this.initForm();
    this.userIdEdit = user.id;
    this.isEditing = true;
    this.isFormDialogOpen = true;
    this.form.patchValue({
      userLoginControl: user.login,
      userNameControl: user.name,
      userEmailControl: user.email,
      userGroupControl: this.groups.find((g) => g.id === user.group.id)!,
      userRoleControl: this.userRoles.find((ur) => ur.id === user.role.id)!,
      userPasswordControl: user.password!,
    });
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите данные о пользователе?',
      accept: () => {
        this.userService.deleteUser(user);
        this.deleteUserResponce$
          .pipe(
            skipWhile((responce) => responce === 'pending'),
            take(1)
          )
          .subscribe((responce) => {
            if (responce === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Данные о пользователе удалены',
              });
            }
          });
      },
    });
  }

  onSubmitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const {
      userLoginControl,
      userPasswordControl,
      userNameControl,
      userEmailControl,
      userGroupControl,
      userRoleControl,
    } = this.form.value;
    if (this.isEditing) {
      this.userService.updateUser(
        this.userIdEdit,
        userLoginControl!,
        userPasswordControl!,
        userNameControl!,
        userEmailControl!,
        userGroupControl!,
        userRoleControl!
      );
      this.updateUserResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          if (responce === 'success') {
            this.isFormDialogOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные о пользователе обновлены',
            });
          }
        });
    } else {
      this.userService.createUser(
        userPasswordControl!,
        userLoginControl!,
        userNameControl!,
        userEmailControl!,
        userGroupControl!,
        userRoleControl!
      );
      this.createUserResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          if (responce === 'success') {
            this.isFormDialogOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные о пользователе добавлены',
            });
          }
        });
    }
  }
}

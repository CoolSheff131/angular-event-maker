import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { distinctUntilChanged, map, merge, skipWhile, take } from 'rxjs';
import { Group } from 'src/app/api/interfaces/group.interface';
import { UserRole } from 'src/app/api/interfaces/user.interface';
import { UserService } from '../services/user.service';

@Component({
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css'],
})
export class AdminUserRolesComponent {
  isformGroupDialogOpen = false;
  isEditing = false;

  userRoleIdEdit = '0';
  form = new FormGroup({
    userRoleName: new FormControl<string>('', [Validators.required]),
  });

  deleteUserRoleResponce$ = this.userService.deleteUserRoleResponce$;
  updateUserRoleResponce$ = this.userService.updateUserRolesResponce$;
  createUserRoleResponce$ = this.userService.createUserRoleResponce$;
  getAllUserRolesResponce$ = this.userService.getAllUserRolesResponce$;

  userRoles: UserRole[] = [];

  constructor(
    private readonly userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    userService.userRoles$.subscribe((userRoles) => {
      this.userRoles = userRoles;
    });
    merge(this.createUserRoleResponce$, this.updateUserRoleResponce$)
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

  editUserRole(userRole: UserRole) {
    this.isEditing = true;
    this.userRoleIdEdit = userRole.id;
    this.form.patchValue({ userRoleName: userRole.name });
    this.openAddDialog();
  }
  deleteUserRole(userRole: UserRole) {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите данные о роли пользователя?',
      accept: () => {
        this.userService.deleteUserRole(userRole);
        this.deleteUserRoleResponce$
          .pipe(
            skipWhile((responce) => responce === 'pending'),
            take(1)
          )
          .subscribe((responce) => {
            if (responce === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Данные о роли пользователя удалены',
              });
            }
          });
      },
    });
  }

  openAddDialog() {
    this.isformGroupDialogOpen = true;
  }

  closeFormDialog() {
    this.isformGroupDialogOpen = false;
  }

  onSubmitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { userRoleName } = this.form.value;
    if (this.isEditing) {
      this.userService.updateUserRole(this.userRoleIdEdit, userRoleName!);
      this.updateUserRoleResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          if (responce === 'success') {
            this.isformGroupDialogOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные о роли пользователя обновлены',
            });
          }
        });
    } else {
      this.userService.createUserRole(userRoleName!);
      this.createUserRoleResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          if (responce === 'success') {
            this.isformGroupDialogOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные о роли пользователя добавлены',
            });
          }
        });
    }
  }
}

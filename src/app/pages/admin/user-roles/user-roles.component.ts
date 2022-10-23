import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { skipWhile, take } from 'rxjs';
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
  userRoleForm = new FormGroup({
    userRoleName: new FormControl<string>('', [Validators.required]),
  });

  get deleteUserRoleResponce$() {
    return this.userService.deleteUserRoleResponce$;
  }
  get updateUserRoleResponce$() {
    return this.userService.updateUserRolesResponce$;
  }
  get createUserRoleResponce$() {
    return this.userService.createUserRoleResponce$;
  }
  get getAllUserRolesResponce$() {
    return this.userService.getAllUserRolesResponce$;
  }

  userRoles: UserRole[] = [];

  constructor(
    private readonly userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    userService.userRoles$.subscribe((userRoles) => {
      this.userRoles = userRoles;
    });
  }

  editUserRole(userRole: UserRole) {
    this.isEditing = true;
    this.userRoleIdEdit = userRole.id;
    this.userRoleForm.patchValue({ userRoleName: userRole.name });
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
    if (this.userRoleForm.invalid) {
      this.userRoleForm.markAllAsTouched();
      return;
    }
    const { userRoleName } = this.userRoleForm.value;
    if (this.isEditing) {
      this.userService.updateUserRole(this.userRoleIdEdit, userRoleName!);
      this.updateUserRoleResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          console.log(responce);
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
          console.log(responce);

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

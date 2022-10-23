import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  userRoles: UserRole[] = [];

  constructor(private readonly userService: UserService) {
    userService.userRoles$.subscribe((userRoles) => {
      this.userRoles = userRoles;
    });
  }

  editGroup(group: Group) {
    this.isEditing = true;
    this.userRoleIdEdit = group.id;
    this.userRoleForm.patchValue({ userRoleName: group.name });
    this.openAddDialog();
  }
  deleteUserRole(userRole: UserRole) {
    this.userService.deleteUserRole(userRole);
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
    } else {
      this.userService.createUserRole(userRoleName!);
    }
  }
}

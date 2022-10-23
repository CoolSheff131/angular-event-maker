import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  userForm = new FormGroup({
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

  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService
  ) {
    userService.allUsers$.subscribe((users) => {
      this.users = users;
      console.log(users);
    });
    groupService.groups$.subscribe((groups) => {
      this.groups = groups;
    });
    userService.userRoles$.subscribe((userRoles) => {
      this.userRoles = userRoles;
    });
    groupService.getGroups();
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
    this.userForm.reset();
  }

  closeFormDialog() {
    this.isFormDialogOpen = false;
  }

  editUser(user: UserStudent) {
    this.initForm();
    this.userIdEdit = user.id;
    this.isEditing = true;
    this.isFormDialogOpen = true;
    this.userForm.patchValue({
      userLoginControl: user.login,
      userNameControl: user.name,
      userEmailControl: user.email,
      userGroupControl: this.groups.find((g) => g.id === user.group.id)!,
      userRoleControl: this.userRoles.find((ur) => ur.id === user.role.id)!,
      userPasswordControl: user.password!,
    });
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user);
  }

  onSubmitUserForm() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const {
      userLoginControl,
      userPasswordControl,
      userNameControl,
      userEmailControl,
      userGroupControl,
      userRoleControl,
    } = this.userForm.value;
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
    } else {
      this.userService.createUser(
        userPasswordControl!,
        userLoginControl!,
        userNameControl!,
        userEmailControl!,
        userGroupControl!,
        userRoleControl!
      );
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  userLoginControl = new FormControl<string>('');
  userNameControl = new FormControl<string>('');
  userEmailControl = new FormControl<string>('');
  userGroupControl = new FormControl<Group | null>(null);
  userPasswordControl = new FormControl<string>('');
  userIdEdit = '';

  users: UserStudent[] = [];
  groups: Group[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService
  ) {
    userService.allStudents$.subscribe((users) => {
      this.users = users;
      console.log(users);
    });
    groupService.groups$.subscribe((groups) => {
      this.groups = groups;
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
    this.userLoginControl.setValue('');
    this.userNameControl.setValue('');
    this.userEmailControl.setValue('');
    this.userGroupControl.setValue(null);
  }

  initForm() {
    this.userLoginControl = new FormControl<string>('');
    this.userNameControl = new FormControl<string>('');
    this.userEmailControl = new FormControl<string>('');
    this.userGroupControl = new FormControl<Group | null>(null);
  }

  closeFormDialog() {
    this.isFormDialogOpen = false;
  }

  editUser(user: UserStudent) {
    this.initForm();
    this.userIdEdit = user.id;
    this.isEditing = true;
    this.isFormDialogOpen = true;
    this.userLoginControl.setValue(user.login);
    this.userNameControl.setValue(user.name);
    this.userEmailControl.setValue(user.email);
    this.userGroupControl.setValue(user.group);
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user);
  }

  onSubmitUserForm() {
    if (!this.userLoginControl.value?.trim()) {
      return;
    }

    if (!this.userNameControl.value?.trim()) {
      return;
    }
    if (!this.userEmailControl.value?.trim()) {
      return;
    }

    if (!this.userGroupControl.value) {
      return;
    }

    if (this.isEditing) {
      this.userService.updateUserStudent(
        this.userIdEdit,
        this.userLoginControl.value,
        this.userNameControl.value,
        this.userEmailControl.value,
        this.userGroupControl.value
      );
    } else {
      console.log('ASD');

      if (!this.userPasswordControl.value) {
        return;
      }
      console.log('ASD');
      this.userService.createUserStudent(
        this.userPasswordControl.value,
        this.userLoginControl.value,
        this.userNameControl.value,
        this.userEmailControl.value,
        this.userGroupControl.value
      );
    }
  }
}

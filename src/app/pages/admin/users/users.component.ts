import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/api/interfaces/user.interface';
import { UserService } from 'src/app/pages/admin/services/user.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { AuditoryService } from '../services/auditory.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  addDialog = false;

  auditoryName = new FormControl<string>('');
  users: User[] = [];

  constructor(private readonly userService: UserService) {
    userService.allUsers$.subscribe((users) => {
      this.users = users;
    });
  }
  ngOnInit(): void {
    this.userService.getAllUsers();
  }

  openAddDialog() {
    this.addDialog = true;
  }

  closeAddDialog() {
    this.addDialog = false;
  }

  onSubmitAuditory() {
    if (!this.auditoryName.value?.trim()) {
      return;
    }
    console.log(this.auditoryName.value);
    this.userService.createUser(this.auditoryName.value);
  }
}

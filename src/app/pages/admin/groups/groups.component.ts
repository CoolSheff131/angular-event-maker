import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Group } from 'src/app/api/interfaces/group.interface';
import { GroupService } from 'src/app/pages/admin/services/group.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';

@Component({
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class AdminGroupsComponent implements OnInit {
  editGroup(group: Group) {
    this.isEditingGroup = true;
    this.groupIdEdit = group.id;
    this.groupNameEdit.setValue(group.name);
  }
  deleteGroup(group: Group) {
    this.groupService.deleteGroup(group);
  }
  addDialog = false;

  isEditingGroup = false;
  groupIdEdit = '0';
  groupNameEdit = new FormControl<string>('');

  groupName = new FormControl<string>('');
  groups: Group[] = [];

  constructor(private readonly groupService: GroupService) {
    groupService.groups$.subscribe((groups) => {
      this.groups = groups;
      console.log(groups);
    });
  }
  ngOnInit(): void {
    this.groupService.getGroups();
  }

  openAddDialog() {
    this.addDialog = true;
  }

  closeEditDialog() {
    this.isEditingGroup = false;
  }
  closeAddDialog() {
    this.addDialog = false;
  }

  onSubmitAuditory() {
    if (!this.groupName.value?.trim()) {
      return;
    }
    this.groupService.createGroup(this.groupName.value);
  }

  onSubmitEditAuditory() {
    if (!this.groupNameEdit.value?.trim()) {
      return;
    }
    console.log(this.groupNameEdit.value);

    this.groupService.updateGroup(this.groupIdEdit, this.groupNameEdit.value);
  }
}

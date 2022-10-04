import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Group } from 'src/app/api/interfaces/group.interface';
import { GroupService } from 'src/app/pages/admin/services/group.service';

@Component({
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class AdminGroupsComponent {
  isformGroupDialogOpen = false;
  isEditing = false;

  groupIdEdit = '0';
  groupForm = new FormGroup({
    groupName: new FormControl<string>('', [Validators.required]),
  });

  groups: Group[] = [];

  constructor(private readonly groupService: GroupService) {
    groupService.groups$.subscribe((groups) => {
      this.groups = groups;
      console.log(groups);
    });
  }

  editGroup(group: Group) {
    this.isEditing = true;
    this.groupIdEdit = group.id;
    this.groupForm.controls.groupName.setValue(group.name);
  }
  deleteGroup(group: Group) {
    this.groupService.deleteGroup(group);
  }

  openAddDialog() {
    this.isformGroupDialogOpen = true;
  }

  closeFormDialog() {
    this.isformGroupDialogOpen = false;
  }

  onSubmitForm() {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }
    if (this.isEditing) {
      this.groupService.updateGroup(
        this.groupIdEdit,
        this.groupForm.controls.groupName.value!
      );
    } else {
      this.groupService.createGroup(this.groupForm.controls.groupName.value!);
    }
  }
}

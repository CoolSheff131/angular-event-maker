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
  addDialog = false;

  auditoryName = new FormControl<string>('');
  groups: Group[] = [];

  constructor(private readonly groupService: GroupService) {
    groupService.groups$.subscribe((groups) => {
      this.groups = groups;
    });
  }
  ngOnInit(): void {
    this.groupService.getGroups();
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
    this.groupService.createGroup(this.auditoryName.value);
  }
}

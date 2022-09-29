import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Auditory } from '../../api/interfaces/auditory.interface';
import { AuditoryService } from '../../services/auditory.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  addDialog = false;

  auditoryName = new FormControl<string>('');
  auditories: Auditory[] = [];

  constructor(private readonly auditoryService: AuditoryService) {
    auditoryService.auditories$.subscribe((auditories) => {
      this.auditories = auditories;
    });
  }
  ngOnInit(): void {
    this.auditoryService.getAuditories();
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
    this.auditoryService.createAuditory(this.auditoryName.value);
  }
}
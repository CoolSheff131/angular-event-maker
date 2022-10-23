import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { AuditoryService } from '../services/auditory.service';

@Component({
  selector: 'app-auditories',
  templateUrl: './auditories.component.html',
  styleUrls: ['./auditories.component.css'],
})
export class AdminAuditoriesComponent {
  isFormAuditoryOpen = false;
  isEditing = false;
  auditoryToEditId = '';

  auditoryForm = new FormGroup({
    auditoryName: new FormControl<string>('', [Validators.required]),
  });
  auditories: Auditory[] = [];

  constructor(private readonly auditoryService: AuditoryService) {
    auditoryService.auditories$.subscribe((auditories) => {
      this.auditories = auditories;
    });
  }

  openFormDialogToAdd() {
    this.auditoryForm.reset();
    this.isEditing = false;
    this.openFormDialog();
  }

  openFormDialog() {
    this.isFormAuditoryOpen = true;
  }

  closeFormDialog() {
    this.isFormAuditoryOpen = false;
  }

  onSubmitAuditory() {
    if (this.auditoryForm.invalid) {
      this.auditoryForm.markAllAsTouched();
      return;
    }
    const { auditoryName } = this.auditoryForm.value;
    if (this.isEditing) {
      this.auditoryService.updateAuditory(this.auditoryToEditId, auditoryName!);
    } else {
      this.auditoryService.createAuditory(auditoryName!);
    }
  }

  editAuditory(auditory: Auditory) {
    this.auditoryToEditId = auditory.id;
    this.isEditing = false;
    this.openFormDialog();
    this.auditoryForm.patchValue({
      auditoryName: auditory.name,
    });
  }

  deleteAuditory(auditory: Auditory) {
    this.auditoryService.deleteAuditory(auditory);
  }
}

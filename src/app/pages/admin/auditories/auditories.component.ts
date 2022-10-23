import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { skipWhile, take } from 'rxjs';
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

  deleteAuditoryResponce$ = this.auditoryService.deleteAuditoryResponce$;
  createAuditoryResponce$ = this.auditoryService.createAuditoryResponce$;
  updateAuditoryResponce$ = this.auditoryService.updateAuditoryResponce$;
  getAllAuditoriesResponce$ = this.auditoryService.getAllAuditoriesResponce$;

  constructor(
    private readonly auditoryService: AuditoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
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
      this.updateAuditoryResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          console.log(responce);
          if (responce === 'success') {
            this.isFormAuditoryOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные об аудитории обновлены',
            });
          }
        });
    } else {
      this.auditoryService.createAuditory(auditoryName!);
      this.createAuditoryResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          if (responce === 'success') {
            this.isFormAuditoryOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные об аудитории добавлены',
            });
          }
        });
    }
  }

  editAuditory(auditory: Auditory) {
    this.auditoryToEditId = auditory.id;
    this.isEditing = true;
    this.openFormDialog();
    this.auditoryForm.patchValue({
      auditoryName: auditory.name,
    });
  }

  deleteAuditory(auditory: Auditory) {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите данные об аудитории?',
      accept: () => {
        this.auditoryService.deleteAuditory(auditory);

        this.deleteAuditoryResponce$
          .pipe(
            skipWhile((responce) => responce === 'pending'),
            take(1)
          )
          .subscribe((responce) => {
            if (responce === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Данные об аудитории удалены',
              });
            }
          });
      },
    });
  }
}

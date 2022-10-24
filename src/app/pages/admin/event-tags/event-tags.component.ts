import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { distinctUntilChanged, map, merge, skipWhile, take } from 'rxjs';
import { EventTag } from 'src/app/api/interfaces/eventTag.interface';
import { EventTagService } from 'src/app/pages/admin/services/eventTag.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { AuditoryService } from '../services/auditory.service';

@Component({
  selector: 'app-event-tags',
  templateUrl: './event-tags.component.html',
  styleUrls: ['./event-tags.component.css'],
})
export class AdminEventTagsComponent {
  isFormDialogOpen = false;
  isEditing = false;
  eventTagIdEdit = '';

  form = new FormGroup({
    eventTagName: new FormControl<string>('', [Validators.required]),
  });

  eventTags: EventTag[] = [];

  deleteEventTagResponce$ = this.eventTagService.deleteEventTagResponce$;
  createEventTagResponce$ = this.eventTagService.createEventTagResponce$;
  updateEventTagResponce$ = this.eventTagService.updateEventTagResponce$;
  getAllEventsTagResponce$ = this.eventTagService.getAllEventsTagResponce$;

  constructor(
    private readonly eventTagService: EventTagService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    eventTagService.eventTags$.subscribe((auditories) => {
      this.eventTags = auditories;
    });

    merge(this.createEventTagResponce$, this.updateEventTagResponce$)
      .pipe(
        distinctUntilChanged(),
        map((status) => status === 'pending')
      )
      .subscribe((isDisabled) => {
        if (isDisabled) {
          this.form.disable();
        } else {
          this.form.enable();
        }
      });
  }

  openFormDialogToAdd() {
    this.isEditing = false;
    this.form.reset();
    this.openFormDialog();
  }
  openFormDialog() {
    this.isFormDialogOpen = true;
  }

  closeFormDialog() {
    this.isFormDialogOpen = false;
  }

  onSubmitEventTagForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { eventTagName } = this.form.value;
    if (this.isEditing) {
      this.eventTagService.updateEventTag(this.eventTagIdEdit, eventTagName!);
      this.isEditing = false;
      this.updateEventTagResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          console.log(responce);
          if (responce === 'success') {
            this.isFormDialogOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные об теге мероприятия обновлены',
            });
          }
        });
    } else {
      this.eventTagService.createEventTag(eventTagName!);
      this.createEventTagResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          if (responce === 'success') {
            this.isFormDialogOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные об теге мероприятия добавлены',
            });
          }
        });
    }
  }

  editEventTag(eventTag: EventTag) {
    this.openFormDialog();
    this.isEditing = true;
    this.eventTagIdEdit = eventTag.id;
    this.form.patchValue({ eventTagName: eventTag.name });
  }
  deleteEventTag(group: EventTag) {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите данные о теге мероприятия?',
      accept: () => {
        this.eventTagService.deleteEventTag(group);

        this.deleteEventTagResponce$
          .pipe(
            skipWhile((responce) => responce === 'pending'),
            take(1)
          )
          .subscribe((responce) => {
            if (responce === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Данные о теге мероприятия удалены',
              });
            }
          });
      },
    });
  }
}

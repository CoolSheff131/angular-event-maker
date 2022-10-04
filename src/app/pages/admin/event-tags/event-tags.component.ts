import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  eventTagForm = new FormGroup({
    eventTagName: new FormControl<string>('', [Validators.required]),
  });

  eventTags: EventTag[] = [];

  constructor(private readonly eventTagService: EventTagService) {
    eventTagService.eventTags$.subscribe((auditories) => {
      this.eventTags = auditories;
    });
  }

  openFormDialogToAdd() {
    this.isEditing = false;
    this.eventTagForm.reset();
    this.openFormDialog();
  }
  openFormDialog() {
    this.isFormDialogOpen = true;
  }

  closeFormDialog() {
    this.isFormDialogOpen = false;
  }

  onSubmitEventTagForm() {
    if (!this.eventTagForm.invalid) {
      this.eventTagForm.markAllAsTouched();
      return;
    }

    if (this.isEditing) {
      this.eventTagService.updateEventTag(
        this.eventTagIdEdit,
        this.eventTagForm.controls.eventTagName.value!
      );
      this.isEditing = false;
    } else {
      this.eventTagService.createEventTag(
        this.eventTagForm.controls.eventTagName.value!
      );
    }
  }

  editEventTag(eventTag: EventTag) {
    this.openFormDialog();
    this.isEditing = true;
    this.eventTagIdEdit = eventTag.id;
    this.eventTagForm.controls.eventTagName.setValue(eventTag.name);
  }
  deleteEventTag(group: EventTag) {
    this.eventTagService.deleteEventTag(group);
  }
}

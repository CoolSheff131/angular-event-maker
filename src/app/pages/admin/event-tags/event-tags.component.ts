import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventTag } from 'src/app/api/interfaces/eventTag.interface';
import { EventTagService } from 'src/app/pages/admin/services/eventTag.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { AuditoryService } from '../services/auditory.service';

@Component({
  selector: 'app-event-tags',
  templateUrl: './event-tags.component.html',
  styleUrls: ['./event-tags.component.css'],
})
export class AdminEventTagsComponent implements OnInit {
  addDialog = false;
  isEditDialogShown = false;

  eventTagNameEdit = new FormControl<string>('');
  eventTagNameAdd = new FormControl<string>('');
  eventTags: EventTag[] = [];

  constructor(private readonly eventTagService: EventTagService) {
    eventTagService.eventTags$.subscribe((auditories) => {
      this.eventTags = auditories;
    });
  }
  ngOnInit(): void {
    this.eventTagService.getEventTags();
  }

  openAddDialog() {
    this.addDialog = true;
  }

  closeAddDialog() {
    this.addDialog = false;
  }

  onSubmitAuditory() {
    if (!this.eventTagNameAdd.value?.trim()) {
      return;
    }
    this.eventTagService.createEventTag(this.eventTagNameAdd.value);
  }

  closeEditDialog() {
    this.isEditDialogShown = false;
  }

  eventTagIdEdit = '';

  editEventTag(eventTag: EventTag) {
    this.isEditDialogShown = true;
    this.eventTagIdEdit = eventTag.id;
    this.eventTagNameEdit.setValue(eventTag.name);
  }
  deleteGroup(group: EventTag) {
    this.eventTagService.deleteEventTag(group);
  }

  onSubmitEditAuditory() {
    if (!this.eventTagNameEdit.value?.trim()) {
      return;
    }
    this.eventTagService.updateEventTag(
      this.eventTagIdEdit,
      this.eventTagNameEdit.value
    );
  }
}

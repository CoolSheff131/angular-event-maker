import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventReview } from 'src/app/api/interfaces/eventReview.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { AuditoryService } from '../services/auditory.service';
import { EventService } from '../services/event.service';
import { EventReviewService } from '../services/eventReview.service';

@Component({
  selector: 'app-event-reviews',
  templateUrl: './event-reviews.component.html',
  styleUrls: ['./event-reviews.component.css'],
})
export class AdminEventReviewsComponent {
  isFormDialogOpen = false;
  isEditing = false;
  idEditing = '';

  eventReviewForm = new FormGroup({
    reviewer: new FormControl<User | null>(null, [Validators.required]),
    text: new FormControl('', [Validators.required]),
    images: new FormControl<File[] | null>(null, [Validators.required]),
  });

  eventReviews: EventReview[] = [];

  constructor(private readonly eventReviewsService: EventReviewService) {
    eventReviewsService.eventReviews$.subscribe((eventReviews) => {
      this.eventReviews = eventReviews;
    });
  }

  openAddDialog() {
    this.isFormDialogOpen = true;
    this.isEditing = false;
  }

  editEventReview(eventReview: EventReview) {
    this.isFormDialogOpen = true;
    this.isEditing = true;
    this.idEditing = eventReview.id;
  }

  closeAddDialog() {
    this.isFormDialogOpen = false;
  }

  onSubmitAuditory() {
    if (this.eventReviewForm.invalid) {
      this.eventReviewForm.markAllAsTouched();
      return;
    }
    if (this.isEditing) {
      this.eventReviewsService.updateEventReview(
        this.idEditing,
        this.eventReviewForm.controls.reviewer.value!,
        this.eventReviewForm.controls.text.value!,
        this.eventReviewForm.controls.images.value!
      );
    } else {
    }
    // this.auditoryService.createAuditory(this.auditoryName.value);
  }
}

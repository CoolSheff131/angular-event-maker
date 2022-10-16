import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Event } from 'src/app/api/interfaces/event.interface';
import { EventReview } from 'src/app/api/interfaces/eventReview.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { AuditoryService } from '../services/auditory.service';
import { EventService } from '../services/event.service';
import { EventReviewService } from '../services/eventReview.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-event-reviews',
  templateUrl: './event-reviews.component.html',
  styleUrls: ['./event-reviews.component.css'],
})
export class AdminEventReviewsComponent {
  isFormDialogOpen = false;
  isEditing = false;
  idEditing = '';

  users: User[] = [];
  events: Event[] = [];

  eventReviewForm = new FormGroup({
    reviewer: new FormControl<User | null>(null, [Validators.required]),
    text: new FormControl('', [Validators.required]),
    images: new FormControl<File[] | null>(null),
    rate: new FormControl<number>(1, [Validators.required]),
    event: new FormControl<Event | null>(null, [Validators.required]),
  });
  previewImagesUrls: SafeUrl[] | undefined;

  eventReviews: EventReview[] = [];

  constructor(
    private readonly eventReviewsService: EventReviewService,
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private domSanitizer: DomSanitizer
  ) {
    eventService.events$.subscribe((events) => {
      this.events = events;
    });
    userService.allUsers$.subscribe((users) => {
      this.users = users;
    });
    eventReviewsService.eventReviews$.subscribe((eventReviews) => {
      this.eventReviews = eventReviews;
    });
  }

  openAddDialog() {
    this.isFormDialogOpen = true;
    this.isEditing = false;
    this.eventReviewForm.reset();
  }

  editEventReview(eventReview: EventReview) {
    this.isFormDialogOpen = true;
    this.isEditing = true;
    this.idEditing = eventReview.id;
    this.previewImagesUrls = eventReview.images;

    this.eventReviewForm.reset();
    console.log(eventReview);
    this.eventReviewForm.patchValue({
      images: null,
      rate: eventReview.rate,
      text: eventReview.text,
      reviewer: this.users.find((u) => u.id === eventReview.reviewer.id),
      event: this.events.find((e) => e.id === eventReview.event.id),
    });
    this.eventReviewForm.markAllAsTouched();
    console.log(this.eventReviewForm.controls.reviewer.value);
  }

  deleteEventReview(eventReview: EventReview) {
    this.eventReviewsService.deleteEventReview(eventReview.id);
  }

  closeAddDialog() {
    this.isFormDialogOpen = false;
  }

  handleFileChange(event: any) {
    this.eventReviewForm.controls.images.setValue(
      Array.from(event.target.files)
    );
    if (this.eventReviewForm.controls.images.value) {
      this.previewImagesUrls = this.eventReviewForm.controls.images.value.map(
        (f) => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(f))
      );
    }
  }

  onSubmitAuditory() {
    console.log(this.eventReviewForm);
    if (this.eventReviewForm.invalid) {
      this.eventReviewForm.markAllAsTouched();
      return;
    }
    if (this.isEditing) {
      this.eventReviewsService.updateEventReview(
        this.idEditing,
        this.eventReviewForm.controls.reviewer.value!,
        this.eventReviewForm.controls.text.value!,
        this.eventReviewForm.controls.images.value!,
        this.eventReviewForm.controls.rate.value!,
        this.eventReviewForm.controls.event.value!
      );
    } else {
      this.eventReviewsService.createEventReview(
        this.eventReviewForm.controls.images.value!,
        this.eventReviewForm.controls.rate.value!,
        this.eventReviewForm.controls.text.value!,
        this.eventReviewForm.controls.reviewer.value!,
        this.eventReviewForm.controls.event.value!
      );
    }
    // this.auditoryService.createAuditory(this.auditoryName.value);
  }
}

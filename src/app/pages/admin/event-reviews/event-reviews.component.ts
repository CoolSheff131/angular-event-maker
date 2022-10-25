import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { distinctUntilChanged, map, merge, skipWhile, take } from 'rxjs';
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

  form = new FormGroup({
    reviewer: new FormControl<User | null>(null, [Validators.required]),
    text: new FormControl('', [Validators.required]),
    images: new FormControl<File[] | null>(null),
    rate: new FormControl<number>(1, [Validators.required]),
    event: new FormControl<Event | null>(null, [Validators.required]),
  });
  previewImagesUrls: SafeUrl[] | undefined;

  deleteEventReviewResponce$ =
    this.eventReviewsService.deleteEventReviewResponce$;
  createEventReviewResponce$ =
    this.eventReviewsService.createEventReviewResponce$;
  updateEventReviewResponce$ =
    this.eventReviewsService.updateEventReviewResponce$;
  getAllEventReviewsResponce$ =
    this.eventReviewsService.getAllEventReviewsResponce$;

  eventReviews: EventReview[] = [];

  constructor(
    private readonly eventReviewsService: EventReviewService,
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private domSanitizer: DomSanitizer,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

    merge(this.createEventReviewResponce$, this.updateEventReviewResponce$)
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

  openAddDialog() {
    this.isFormDialogOpen = true;
    this.isEditing = false;
    this.form.reset();
  }

  editEventReview(eventReview: EventReview) {
    this.isFormDialogOpen = true;
    this.isEditing = true;
    this.idEditing = eventReview.id;
    this.previewImagesUrls = eventReview.images;

    this.form.reset();
    this.form.patchValue({
      images: null,
      rate: eventReview.rate,
      text: eventReview.text,
      reviewer: this.users.find((u) => u.id === eventReview.reviewer.id),
      event: this.events.find((e) => e.id === eventReview.event.id),
    });
    this.form.markAllAsTouched();
  }

  deleteEventReview(eventReview: EventReview) {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите данные об обзоре мероприятия?',
      accept: () => {
        this.eventReviewsService.deleteEventReview(eventReview.id);

        this.deleteEventReviewResponce$
          .pipe(
            skipWhile((responce) => responce === 'pending'),
            take(1)
          )
          .subscribe((responce) => {
            if (responce === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Данные об обзоре мероприятия удалены',
              });
            }
          });
      },
    });
  }

  closeAddDialog() {
    this.isFormDialogOpen = false;
  }

  handleFileChange(event: any) {
    this.form.controls.images.setValue(Array.from(event.target.files));
    if (this.form.controls.images.value) {
      this.previewImagesUrls = this.form.controls.images.value.map((f) =>
        this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(f))
      );
    }
  }

  onSubmitEventReview() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { reviewer, text, images, rate, event } = this.form.value;
    if (this.isEditing) {
      this.eventReviewsService.updateEventReview(
        this.idEditing,
        reviewer!,
        text!,
        images!,
        rate!,
        event!
      );
      this.updateEventReviewResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          if (responce === 'success') {
            this.isFormDialogOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные об обзоре мероприятия обновлены',
            });
          }
        });
    } else {
      this.eventReviewsService.createEventReview(
        images!,
        rate!,
        text!,
        reviewer!,
        event!
      );
      this.createEventReviewResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          if (responce === 'success') {
            this.isFormDialogOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные об обзоре мероприятия добавлены',
            });
          }
        });
    }
  }
}

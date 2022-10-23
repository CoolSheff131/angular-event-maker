import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { Event } from 'src/app/api/interfaces/event.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { ApiService, ResponceStatus } from '../../../api/api.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { EventReview } from '../../../api/interfaces/eventReview.interface';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class EventReviewService {
  private deleteEventReviewResponce = new BehaviorSubject<ResponceStatus>(
    'none'
  );
  private createEventReviewResponce = new BehaviorSubject<ResponceStatus>(
    'none'
  );
  private updateEventReviewResponce = new BehaviorSubject<ResponceStatus>(
    'none'
  );
  private getAllEventReviewsResponce = new BehaviorSubject<ResponceStatus>(
    'none'
  );

  deleteEventReviewResponce$ = this.deleteEventReviewResponce.asObservable();
  createEventReviewResponce$ = this.createEventReviewResponce.asObservable();
  updateEventReviewResponce$ = this.updateEventReviewResponce.asObservable();
  getAllEventReviewsResponce$ = this.getAllEventReviewsResponce.asObservable();

  private eventReviews = new BehaviorSubject<EventReview[]>([]);

  eventReviews$ = this.eventReviews.asObservable();

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService
  ) {
    this.getEventReviews();
  }

  createEventReview(
    images: File[],
    rate: number,
    text: string,
    reviewer: User,
    event: Event
  ) {
    this.createEventReviewResponce.next('pending');
    this.apiService
      .createEventReview(images, rate, text, reviewer, event)
      .pipe(tap(() => this.getEventReviews()))
      .subscribe({
        next: () => {
          this.createEventReviewResponce.next('success');
        },
        error: () => {
          this.createEventReviewResponce.next('error');
        },
      });
  }

  updateEventReview(
    id: string,
    reviewer: User,
    text: string,
    images: File[],
    rate: number,
    event: Event
  ) {
    this.updateEventReviewResponce.next('pending');

    this.apiService
      .updateEventReview(id, { reviewer, text, rate, event }, images)
      .pipe(tap(() => this.getEventReviews()))
      .subscribe({
        next: () => {
          this.updateEventReviewResponce.next('success');
        },
        error: () => {
          this.updateEventReviewResponce.next('error');
        },
      });
  }

  deleteEventReview(id: string) {
    this.deleteEventReviewResponce.next('pending');

    this.apiService
      .deleteEventReview(id)
      .pipe(tap(() => this.getEventReviews()))
      .subscribe({
        next: () => {
          this.deleteEventReviewResponce.next('success');
        },
        error: () => {
          this.deleteEventReviewResponce.next('error');
        },
      });
  }

  getEventReviews() {
    this.getAllEventReviewsResponce.next('pending');

    this.apiService.getEventReviews().subscribe({
      next: (eventReviews) => {
        this.eventReviews.next(eventReviews);
        this.getAllEventReviewsResponce.next('success');
      },
      error: () => {
        this.getAllEventReviewsResponce.next('error');
      },
    });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { Event } from 'src/app/api/interfaces/event.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { ApiService } from '../../../api/api.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { EventReview } from '../../../api/interfaces/eventReview.interface';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class EventReviewService {
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
    this.apiService
      .createEventReview(images, rate, text, reviewer, event)
      .pipe(tap(() => this.getEventReviews()))
      .subscribe();
  }

  updateEventReview(
    id: string,
    reviewer: User,
    text: string,
    images: File[],
    rate: number,
    event: Event
  ) {
    this.apiService
      .updateEventReview(id, { reviewer, text, rate, event }, images)
      .pipe(tap(() => this.getEventReviews()))
      .subscribe();
  }

  deleteEventReview(id: string) {
    this.apiService
      .deleteEventReview(id)
      .pipe(tap(() => this.getEventReviews()))
      .subscribe();
  }

  getEventReviews() {
    this.apiService.getEventReviews().subscribe({
      next: (eventReviews) => {
        this.eventReviews.next(eventReviews);
      },
    });
  }
}

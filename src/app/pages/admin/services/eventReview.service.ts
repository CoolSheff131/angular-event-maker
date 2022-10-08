import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { User } from 'src/app/api/interfaces/user.interface';
import { ApiService } from '../../../api/api.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { EventReview } from '../../../api/interfaces/eventReview.interface';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class EventReviewService {
  private eventReviews = new Subject<EventReview[]>();

  eventReviews$ = this.eventReviews.asObservable();

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService
  ) {
    this.getEventReviews();
  }

  createEventReview(value: string) {
    this.apiService
      .createEventReview({ text: '', id: '', images: [] })
      .pipe(tap(() => this.getEventReviews()))
      .subscribe();
  }

  updateEventReview(id: string, reviewer: User, text: string, images: File[]) {
    this.apiService
      .updateEventReview(id, { reviewer, text }, images)
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

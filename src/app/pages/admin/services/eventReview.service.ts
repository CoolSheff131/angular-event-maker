import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { ApiService } from '../../../api/api.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { EventReview } from '../../../api/interfaces/eventReview.interface';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class EventReviewService {
  private eventReviews = new Subject<EventReview[]>();

  groups$ = this.eventReviews.asObservable();
  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService
  ) {}

  createEventReview(value: string) {
    this.apiService
      .createEventReview({ text: '', id: '', images: [] })
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

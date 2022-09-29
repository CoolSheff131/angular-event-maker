import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { ApiService } from '../../../api/api.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { EventTag } from '../../../api/interfaces/eventTag.interface';

@Injectable({ providedIn: 'root' })
export class EventTagService {
  private eventTags = new Subject<EventTag[]>();

  eventTags$ = this.eventTags.asObservable();
  constructor(private readonly apiService: ApiService) {}

  createEventTag(value: string) {
    this.apiService
      .createEventTag(value)
      .pipe(tap(() => this.getEventTags()))
      .subscribe();
  }
  getEventTags() {
    this.apiService.getEventTags().subscribe({
      next: (groups) => {
        this.eventTags.next(groups);
      },
    });
  }
}

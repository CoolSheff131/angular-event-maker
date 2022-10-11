import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { ApiService } from '../../../api/api.service';
import { EventTag } from '../../../api/interfaces/eventTag.interface';

@Injectable({ providedIn: 'root' })
export class EventTagService {
  private eventTags = new BehaviorSubject<EventTag[]>([]);

  eventTags$ = this.eventTags.asObservable();
  constructor(private readonly apiService: ApiService) {
    this.getEventTags();
  }

  createEventTag(tagName: string) {
    this.apiService
      .createEventTag({ id: '', name: tagName })
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
  updateEventTag(eventTagIdEdit: string, eventTagName: string) {
    this.apiService
      .updateEventTag(eventTagIdEdit, { name: eventTagName })
      .pipe(tap(() => this.getEventTags()))
      .subscribe();
  }
  deleteEventTag(group: EventTag) {
    this.apiService
      .deleteEventTag(group.id)
      .pipe(tap(() => this.getEventTags()))
      .subscribe();
  }
}

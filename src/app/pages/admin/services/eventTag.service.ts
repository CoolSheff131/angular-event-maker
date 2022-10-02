import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { ApiService } from '../../../api/api.service';
import { EventTag } from '../../../api/interfaces/eventTag.interface';

@Injectable({ providedIn: 'root' })
export class EventTagService {
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
  private eventTags = new Subject<EventTag[]>();

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
}

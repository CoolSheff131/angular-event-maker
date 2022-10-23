import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { ApiService, ResponceStatus } from '../../../api/api.service';
import { EventTag } from '../../../api/interfaces/eventTag.interface';

@Injectable({ providedIn: 'root' })
export class EventTagService {
  private deleteEventTagResponce = new BehaviorSubject<ResponceStatus>('none');
  private createEventTagResponce = new BehaviorSubject<ResponceStatus>('none');
  private updateEventTagResponce = new BehaviorSubject<ResponceStatus>('none');
  private getAllEventsTagResponce = new BehaviorSubject<ResponceStatus>('none');

  deleteEventTagResponce$ = this.deleteEventTagResponce.asObservable();
  createEventTagResponce$ = this.createEventTagResponce.asObservable();
  updateEventTagResponce$ = this.updateEventTagResponce.asObservable();
  getAllEventsTagResponce$ = this.getAllEventsTagResponce.asObservable();

  private eventTags = new BehaviorSubject<EventTag[]>([]);

  eventTags$ = this.eventTags.asObservable();
  constructor(private readonly apiService: ApiService) {
    this.getEventTags();
  }

  createEventTag(tagName: string) {
    this.createEventTagResponce.next('pending');
    this.apiService
      .createEventTag({ id: '', name: tagName })
      .pipe(tap(() => this.getEventTags()))
      .subscribe({
        next: () => {
          this.createEventTagResponce.next('success');
        },
        error: () => {
          this.createEventTagResponce.next('error');
        },
      });
  }
  getEventTags() {
    this.getAllEventsTagResponce.next('pending');
    this.apiService.getEventTags().subscribe({
      next: (groups) => {
        this.eventTags.next(groups);
        this.getAllEventsTagResponce.next('success');
      },
      error: () => {
        this.getAllEventsTagResponce.next('error');
      },
    });
  }
  updateEventTag(eventTagIdEdit: string, eventTagName: string) {
    this.updateEventTagResponce.next('pending');
    this.apiService
      .updateEventTag(eventTagIdEdit, { name: eventTagName })
      .pipe(tap(() => this.getEventTags()))
      .subscribe({
        next: () => {
          this.updateEventTagResponce.next('success');
        },
        error: () => {
          this.updateEventTagResponce.next('error');
        },
      });
  }
  deleteEventTag(group: EventTag) {
    this.deleteEventTagResponce.next('pending');

    this.apiService
      .deleteEventTag(group.id)
      .pipe(tap(() => this.getEventTags()))
      .subscribe({
        next: () => {
          this.deleteEventTagResponce.next('success');
        },
        error: () => {
          this.deleteEventTagResponce.next('error');
        },
      });
  }
}

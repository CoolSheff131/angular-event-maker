import { Component, EventEmitter, Input, Output } from '@angular/core';
import { switchMap } from 'rxjs';
import { Event } from 'src/app/api/interfaces/event.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { EventService } from 'src/app/pages/admin/services/event.service';
import { UserService } from 'src/app/pages/admin/services/user.service';
import { canUserWriteEventReview } from 'src/app/utils/can-user-write-event-review';
import { isEventEnded } from 'src/app/utils/is-event-ended';
import { isUserCameToEvent } from 'src/app/utils/is-user-came-to-event';
import { findUserEventReview } from 'src/app/utils/get-user-event-review';

@Component({
  selector: 'event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.css'],
})
export class EventItemComponent {
  @Input()
  event!: Event;

  @Input()
  buttonGoingItemDisabled: boolean = false;

  @Input()
  buttonNotGoingItemDisabled: boolean = false;

  @Input()
  buttonGoingItemLabel: string = '';

  @Input()
  buttonNotGoingItemLabel: string = '';

  @Output()
  buttonGoingToEventClickEvent = new EventEmitter<Event>();

  @Output()
  buttonNotGoingToEventClickEvent = new EventEmitter<Event>();

  @Output()
  buttonRemoveConfirmPresentClickEvent = new EventEmitter<User>();
  @Output()
  buttonConfirmPresentClickEvent = new EventEmitter<User>();

  authedUser: User | undefined;

  constructor(
    private eventService: EventService,
    private userService: UserService
  ) {
    this.userService.authedUser$.subscribe((user) => {
      this.authedUser = user;
    });
  }

  get isEventEnded() {
    return isEventEnded(this.event);
  }

  handleGoingButtonEventItemClick() {
    this.buttonGoingToEventClickEvent.emit(this.event);
  }

  handleNotGoingButtonEventItemClick() {
    this.buttonNotGoingToEventClickEvent.emit(this.event);
  }

  isUserCameToEvent(user: User) {
    return isUserCameToEvent(this.event!, user);
  }

  handleConfirmPresent(user: User) {
    this.buttonConfirmPresentClickEvent.emit(user);
  }
  removeConfirmPresent(user: User) {
    this.buttonRemoveConfirmPresentClickEvent.emit(user);
  }

  get canUserWriteReview() {
    if (!this.authedUser) {
      return false;
    }
    return canUserWriteEventReview(this.authedUser, this.event);
  }
  get userEventReview() {
    if (!this.authedUser) {
      return undefined;
    }
    return findUserEventReview(this.authedUser, this.event);
  }
}

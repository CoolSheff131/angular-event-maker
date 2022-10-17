import { Component, EventEmitter, Input, Output } from '@angular/core';
import { switchMap } from 'rxjs';
import { Event } from 'src/app/api/interfaces/event.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { EventService } from 'src/app/pages/admin/services/event.service';
import { isEventEnded } from 'src/app/utils/is-event-ended';
import { isUserCameToEvent } from 'src/app/utils/is-user-came-to-event';

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

  constructor(private eventService: EventService) {}

  get isEventEnded() {
    return isEventEnded(this.event);
  }

  handleGoingButtonEventItemClick() {
    this.buttonGoingToEventClickEvent.emit(this.event);
  }

  handleNotGoingButtonEventItemClick() {
    console.log('ASDASFDKNA:PJSND:PASJEF');
    this.buttonNotGoingToEventClickEvent.emit(this.event);
  }

  getDates(event: Event): Date[] {
    return event.days.map((d) => d.date);
  }

  isUserCameToEvent(user: User) {
    return isUserCameToEvent(this.event!, user);
  }

  handleConfirmPresent(user: User) {
    this.eventService
      .confirmPresent(this.event!, user)
      .pipe(
        switchMap(() => {
          return this.eventService.getEvent(this.event.id);
        })
      )
      .subscribe((event) => {
        console.log(event);
        this.event = event;
      });
  }
  removeConfirmPresent(user: User) {
    this.eventService
      .removeConfirmPresent(this.event!, user)
      .pipe(
        switchMap(() => {
          return this.eventService.getEvent(this.event.id);
        })
      )
      .subscribe((event) => {
        console.log(event);
        this.event = event;
      });
  }
}

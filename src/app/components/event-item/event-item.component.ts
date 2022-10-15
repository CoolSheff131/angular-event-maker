import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Event } from 'src/app/api/interfaces/event.interface';
import { isEventEnded } from 'src/app/utils/is-event-ended';

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

  constructor() {}

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
}

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
  buttonItemDisabled: boolean = false;

  @Input()
  buttonItemLabel: string = '';

  @Output()
  buttonClickEvent = new EventEmitter<Event>();

  constructor() {}

  get isEventEnded() {
    return isEventEnded(this.event);
  }

  handleButtonEventItemClick(event: Event) {
    console.log(event);
    this.buttonClickEvent.emit(event);
  }

  getDates(event: Event): Date[] {
    return event.days.map((d) => d.date);
  }
}

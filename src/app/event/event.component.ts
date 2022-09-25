import { Component, OnInit } from '@angular/core';
import { Event } from '../api/interfaces/event.interface';
import { convertDateToString } from '../utils/convert-date-to-string';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent {
  event!: Event;

  constructor() {}

  getHeaderDates() {
    return `Даты проведения ${convertDateToString(
      this.event.dateStart
    )} -  ${convertDateToString(this.event.dateEnd)}`;
  }

  getProgressPeople() {
    if (this.event.peopleWillCome)
      return Math.floor(
        (this.event.peopleWillCome.length / this.event.places) * 100
      );
    return 0;
  }
}

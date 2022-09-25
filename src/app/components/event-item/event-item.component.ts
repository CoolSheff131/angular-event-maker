import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/api/interfaces/event.interface';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.css'],
})
export class EventItemComponent {
  event!: Event;
  constructor() {}
}

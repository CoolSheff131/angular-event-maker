import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/api/interfaces/event.interface';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.css'],
})
export class EventItemComponent implements OnInit {
  event: Event;
  constructor() {
    this.event = {
      dateEnd: new Date(),
      dateStart: new Date(),
      days: [
        { id: '2', auditory: { id: '1', name: '124' }, timeStart: 'timeStart' },
      ],
      description: 'asdf',
      id: '124',
      images: ['asdf'],
      places: 124,
      title: 'asdg',
      tags: [{ name: 'asdf', id: 'asdf' }],
      groups: [{ id: 'asdfg', name: 'apudfngb' }],
    };
  }

  ngOnInit(): void {}
}

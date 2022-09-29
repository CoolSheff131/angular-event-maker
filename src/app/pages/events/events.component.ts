import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  cars = [{ id: 1 }, { id: 2 }, { id: 3 }];
  constructor() {}

  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/api/interfaces/event.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { EventService } from '../../admin/services/event.service';
import { UserService } from '../../admin/services/user.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent {
  events: Event[] = [];
  authedUser: User | undefined;

  constructor(
    private eventService: EventService,
    private userService: UserService
  ) {
    eventService.events$.subscribe((events) => {
      this.events = events;
    });

    userService.authedUser$.subscribe((authedUser) => {
      this.authedUser = authedUser;
    });
  }

  goingToEvent(event: Event) {
    this.eventService.goingToEvent(event, this.authedUser);
  }
}

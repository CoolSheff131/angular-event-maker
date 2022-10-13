import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/api/interfaces/event.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { IsUserGoingToEvent } from 'src/app/utils/is-user-goind-to-event';
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

  handleButtonEventItemClick(event: Event) {
    if (!this.authedUser) {
      return;
    }

    if (this.isAuthedUserGoingToEvent(event)) {
      this.eventService.notGoingToEvent(event, this.authedUser);
    } else {
      this.eventService.goingToEvent(event, this.authedUser);
    }
  }

  isAuthedUserGoingToEvent(event: Event): boolean {
    if (!this.authedUser) {
      return false;
    }

    return IsUserGoingToEvent(this.authedUser, event);
  }

  isButtonEventItemDisalbed(event: Event): boolean {
    return (
      this.authedUser === undefined ||
      (!this.isAuthedUserGoingToEvent(event) &&
        event.places === event.peopleWillCome.length)
    );
  }
}

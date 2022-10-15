import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/api/interfaces/event.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { isEventEnded } from 'src/app/utils/is-event-ended';
import { IsUserGoingToEvent } from 'src/app/utils/is-user-going-to-event';
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

  handleButtonGoingEventItemClick(event: Event) {
    if (!this.authedUser) {
      return;
    }
    this.eventService.goingToEvent(event, this.authedUser).subscribe();
  }

  handleButtonNotGoingEventItemClick(event: Event) {
    if (!this.authedUser) {
      return;
    }

    this.eventService.notGoingToEvent(event, this.authedUser).subscribe();
  }

  isAuthedUserGoingToEvent(event: Event): boolean {
    if (!this.authedUser) {
      return false;
    }

    return IsUserGoingToEvent(this.authedUser, event);
  }

  isButtonGoingEventItemDisalbed(event: Event): boolean {
    return (
      this.authedUser === undefined ||
      this.isAuthedUserGoingToEvent(event) ||
      event.places === event.peopleWillCome.length
    );
  }

  isButtonNotGoingEventItemDisalbed(event: Event): boolean {
    console.log(event.title);
    console.log(
      this.authedUser === undefined || !this.isAuthedUserGoingToEvent(event)
    );
    return (
      this.authedUser === undefined || !this.isAuthedUserGoingToEvent(event)
    );
  }
}

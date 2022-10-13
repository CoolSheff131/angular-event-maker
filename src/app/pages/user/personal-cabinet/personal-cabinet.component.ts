import { Component } from '@angular/core';
import { mergeMap, switchMap, tap } from 'rxjs';
import { Event } from 'src/app/api/interfaces/event.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { EventService } from '../../admin/services/event.service';
import { UserService } from '../../admin/services/user.service';

@Component({
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.css'],
})
export class PersonalCabinetComponent {
  authedUser: User | undefined;
  myEvents: Event[] = [];
  constructor(
    private userService: UserService,
    private eventService: EventService
  ) {
    this.userService.authedUser$
      .pipe(
        switchMap((authedUser) => {
          this.authedUser = authedUser;
          return this.eventService.getUserEvent(authedUser);
        })
      )
      .subscribe((events) => {
        this.myEvents = events;
      });
  }

  handleButtonEventItemClick(event: Event) {
    if (this.authedUser) {
      this.eventService
        .notGoingToEvent(event, this.authedUser)
        .pipe(mergeMap(() => this.eventService.getUserEvent(this.authedUser!)))
        .subscribe((events) => {
          this.myEvents = events;
        });
    }
  }
}

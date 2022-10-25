import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { User } from 'src/app/api/interfaces/user.interface';
import { isEventEnded } from 'src/app/utils/is-event-ended';
import { isUserCameToEvent } from 'src/app/utils/is-user-came-to-event';
import { IsUserGoingToEvent } from 'src/app/utils/is-user-going-to-event';
import { Event } from '../../../api/interfaces/event.interface';
import { convertDateToString } from '../../../utils/convert-date-to-string';
import { EventService } from '../../admin/services/event.service';
import { UserService } from '../../admin/services/user.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent {
  event: Event | undefined;
  authedUser: User | undefined;
  idEvent: string = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private userService: UserService
  ) {
    this.userService.authedUser$.subscribe((authedUser) => {
      this.authedUser = authedUser;
    });
    this.route.params
      .pipe(
        switchMap((params) => {
          this.idEvent = params['id'];
          return eventService.getEvent(this.idEvent);
        })
      )
      .subscribe((event) => {
        this.event = event;
      });
  }

  getProgressPeople() {
    if (this.event!.peopleWillCome)
      return Math.floor(
        (this.event!.peopleWillCome.length / this.event!.places) * 100
      );
    return 0;
  }

  getDates(event: Event): Date[] {
    return event.days.map((d) => d.date);
  }

  handleButtonClick() {
    if (!this.authedUser) {
      return;
    }
    if (this.isAuthedUserGoingToEvent(this.event!)) {
      this.eventService
        .notGoingToEvent(this.event!, this.authedUser)
        .pipe(
          switchMap(() => {
            return this.eventService.getEvent(this.idEvent);
          })
        )
        .subscribe((event) => {
          this.event = event;
        });
    } else {
      this.eventService
        .goingToEvent(this.event!, this.authedUser)
        .pipe(
          switchMap(() => {
            return this.eventService.getEvent(this.idEvent);
          })
        )
        .subscribe((event) => {
          this.event = event;
        });
    }
  }

  isAuthedUserGoingToEvent(event: Event): boolean {
    if (!this.authedUser) {
      return false;
    }

    return IsUserGoingToEvent(this.authedUser, event);
  }

  isButtonEventItemDisalbed(): boolean {
    return (
      this.authedUser === undefined ||
      (!this.isAuthedUserGoingToEvent(this.event!) &&
        this.event!.places === this.event!.peopleWillCome.length)
    );
  }

  get isEventEnded() {
    return isEventEnded(this.event!);
  }

  isUserCameToEvent(user: User) {
    return isUserCameToEvent(this.event!, user);
  }

  handleConfirmPresent(user: User) {
    this.eventService
      .confirmPresent(this.event!, user)
      .pipe(
        switchMap(() => {
          return this.eventService.getEvent(this.idEvent);
        })
      )
      .subscribe((event) => {
        this.event = event;
      });
  }
  removeConfirmPresent(user: User) {
    this.eventService
      .removeConfirmPresent(this.event!, user)
      .pipe(
        switchMap(() => {
          return this.eventService.getEvent(this.idEvent);
        })
      )
      .subscribe((event) => {
        this.event = event;
      });
  }
}

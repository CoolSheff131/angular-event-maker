import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { addDays, differenceInDays } from 'date-fns';
import { Event } from 'src/app/api/interfaces/event.interface';
import { EventDay } from 'src/app/api/interfaces/eventDay.interface';
import { EventTag } from 'src/app/api/interfaces/eventTag.interface';
import { Group } from 'src/app/api/interfaces/group.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { EventService } from 'src/app/pages/admin/services/event.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { AuditoryService } from '../services/auditory.service';
import { EventTagService } from '../services/eventTag.service';
import { GroupService } from '../services/group.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class AdminEventsComponent implements OnInit {
  formDialog = false;
  isEditing = false;
  events: Event[] = [];
  allEventTags: EventTag[] = [];
  allAuditories: Auditory[] = [];
  allGroups: Group[] = [];
  allUsers: User[] = [];

  eventTitle: FormControl<string | null>;
  eventDescription: FormControl<string | null>;
  eventOwner: FormControl<User | null>;
  eventPlaces: FormControl<number | null>;
  eventGroups: FormControl<Group[] | null>;
  eventTags: FormControl<EventTag[] | null>;
  eventImages: FormControl<File[] | null>;
  eventRange: FormControl<[Date, Date | null] | null>;
  eventDays: [
    Date,
    FormControl<Auditory | null>,
    FormControl<string | null>
  ][] = [];

  previewImagesUrls: SafeUrl[] | undefined;
  images: undefined | FileList;

  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly auditoryService: AuditoryService,
    private readonly eventTagsService: EventTagService,
    private readonly groupsService: GroupService,

    private domSanitizer: DomSanitizer
  ) {
    eventService.events$.subscribe((events) => {
      this.events = events;
    });
    userService.allStudents$.subscribe((users) => {
      this.allUsers = users;
    });
    auditoryService.auditories$.subscribe((auditories) => {
      this.allAuditories = auditories;
    });
    eventTagsService.eventTags$.subscribe((eventTags) => {
      this.allEventTags = eventTags;
    });
    groupsService.groups$.subscribe((groups) => {
      this.allGroups = groups;
    });

    this.eventOwner = new FormControl<User | null>(null);
    this.eventTitle = new FormControl<string | null>('');
    this.eventDescription = new FormControl<string | null>('');
    this.eventPlaces = new FormControl<number | null>(null);
    this.eventRange = new FormControl<[Date, Date] | null>(null);
    this.eventGroups = new FormControl<Group[] | null>(null);
    this.eventTags = new FormControl<EventTag[] | null>(null);
    this.eventImages = new FormControl<File[] | null>(null);
  }
  ngOnInit(): void {
    this.eventService.getEvents();
  }

  openAddDialog() {
    this.formDialog = true;
  }

  closeDialog() {
    this.formDialog = false;
  }

  getDayFromStart(dayNumber: number): Date {
    const [dateStart] = this.eventRange.value!;
    const date = addDays(dateStart, dayNumber);

    return date;
  }

  handleFileChange(event: any) {
    this.images = event.target.files;
    if (this.images) {
      this.previewImagesUrls = Array.from(this.images).map((f) =>
        this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(f))
      );
    }
  }
  onSubmitForm() {
    console.log(this.images);
    console.log(this.eventTitle.value);
    console.log(this.eventDescription.value);
    console.log(this.eventOwner.value);
    console.log(this.eventPlaces.value);
    console.log(this.eventGroups.value);
    if (
      !this.images ||
      !this.eventTitle.value ||
      !this.eventDescription.value ||
      !this.eventOwner.value ||
      !this.eventPlaces.value ||
      !this.eventGroups.value
    ) {
      return;
    }
    const days = this.eventDays.map<EventDay>(
      ([day, auditControl, timeControl]) => ({
        id: '',
        day,
        auditory: auditControl.value!,
        timeStart: timeControl.value!,
      })
    );
    console.log(days);
    this.eventService.createEvent(
      this.images,
      this.eventTitle.value,
      this.eventDescription.value,
      this.eventOwner.value,
      this.eventPlaces.value,
      this.eventGroups.value,
      days
    );
  }

  onDateRange() {
    if (this.eventRange.value === null) {
      return;
    }
    const [dateStart, dateEnd] = this.eventRange.value;

    if (dateEnd) {
      const dayCount = differenceInDays(dateEnd, dateStart);
      for (let i = 0; i < dayCount; i++) {
        this.eventDays.push([
          this.getDayFromStart(i),
          new FormControl<Auditory | null>(null),
          new FormControl<string | null>(null),
        ]);
      }
    } else {
      this.eventDays = [];
    }
  }
}

import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  addDays,
  differenceInDays,
  getDate,
  getHours,
  getMinutes,
} from 'date-fns';
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
export class AdminEventsComponent {
  formDialog = false;
  isEditing = false;
  events: Event[] = [];
  allEventTags: EventTag[] = [];
  allAuditories: Auditory[] = [];
  allGroups: Group[] = [];
  allUsers: User[] = [];

  eventForm = new FormGroup({
    eventTitle: new FormControl<string | null>('', [Validators.required]),
    eventDescription: new FormControl<string | null>('', [Validators.required]),
    eventOwner: new FormControl<User | null>(null, [Validators.required]),
    eventPlaces: new FormControl<number | null>(1, [Validators.required]),
    eventGroups: new FormControl<Group[] | null>(null, [Validators.required]),
    eventTags: new FormControl<EventTag[] | null>(null, [Validators.required]),
    eventImages: new FormControl<File[] | null>(null, [Validators.required]),
    eventDays: new FormArray<
      FormGroup<{
        auditory: FormControl<Auditory | null>;
        startDate: FormControl<Date | null>;
      }>
    >([]),
  });

  eventRange: FormControl<[Date, Date | null] | null>;

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
      console.log(events);
    });
    userService.allStudents$.subscribe((users) => {
      this.allUsers = users;
    });
    auditoryService.auditories$.subscribe((auditories) => {
      this.allAuditories = auditories;
      console.log(auditories);
    });
    eventTagsService.eventTags$.subscribe((eventTags) => {
      this.allEventTags = eventTags;
    });
    groupsService.groups$.subscribe((groups) => {
      this.allGroups = groups;
    });

    this.eventRange = new FormControl<[Date, Date] | null>(null, [
      Validators.required,
    ]);
  }

  deleteEvent(event: Event) {
    this.eventService.deleteEvent(event);
  }
  editEvent(event: Event) {
    this.isEditing = true;
    this.formDialog = true;
  }
  getFormsControls(): FormArray {
    return this.eventForm.controls.eventDays as FormArray;
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

  getDayFormat(day: Date) {
    return `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
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
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }
    const days: EventDay[] = [];
    this.eventForm.controls.eventDays.value.forEach((value, i) => {
      days.push({
        id: '',
        day: this.getDayFromStart(i),
        auditory: value.auditory!,
        timeStart: `${getHours(value.startDate!)}:${getMinutes(
          value.startDate!
        )}`,
      });
    });

    this.eventService.createEvent(
      this.images!,
      this.eventForm.controls.eventTitle.value!,
      this.eventForm.controls.eventDescription.value!,
      this.eventForm.controls.eventOwner.value!,
      this.eventForm.controls.eventPlaces.value!,
      this.eventForm.controls.eventGroups.value!,
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
      for (let i = 0; i <= dayCount; i++) {
        this.eventForm.controls.eventDays.push(
          new FormGroup({
            auditory: new FormControl<Auditory | null>(null, [
              Validators.required,
            ]),
            startDate: new FormControl<Date | null>(null, [
              Validators.required,
            ]),
          })
        );
      }
    } else {
      this.eventForm.controls.eventDays.clear();
    }
  }
}

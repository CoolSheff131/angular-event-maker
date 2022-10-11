import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { addDays, getHours, getMinutes } from 'date-fns';
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
  idEditing = '';

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
        date: FormControl<Date | null>;
      }>
    >([], [Validators.required]),
  });

  eventRange: FormControl<Date[] | null>;

  previewImagesUrls: SafeUrl[] | undefined;

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
    this.idEditing = event.id;
    this.isEditing = true;
    this.formDialog = true;
    // this.eventForm.setValue({
    //   eventDays: event.days,
    //   eventDescription: event.description,
    //   eventGroups: event.groups,
    //   eventImages: event.images,
    //   eventOwner: event.owner,
    //   eventPlaces: event.places,
    //   eventTags: event.tags,
    //   eventTitle: event.title,
    // });
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
    this.eventForm.controls.eventImages.setValue(
      Array.from(event.target.files)
    );
    if (this.eventForm.controls.eventImages.value) {
      this.previewImagesUrls = this.eventForm.controls.eventImages.value.map(
        (f) => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(f))
      );
    }
  }

  onSubmitForm() {
    if (this.eventForm.invalid) {
      console.log(this.eventForm);
      this.eventForm.markAllAsTouched();
      return;
    }
    const days: EventDay[] = [];
    this.eventForm.controls.eventDays.value.forEach((value, i) => {
      days.push({
        id: '',
        date: value.date!,
        auditory: value.auditory!,
      });
    });

    const {
      eventImages,
      eventDescription,
      eventGroups,
      eventOwner,
      eventPlaces,
      eventTitle,
      eventTags,
    } = this.eventForm.value;

    if (this.isEditing) {
      this.eventService.updateEvent(
        this.idEditing,
        eventImages!,
        eventTitle!,
        eventDescription!,
        eventOwner!,
        eventPlaces!,
        eventGroups!,
        days,
        eventTags!
      );
    } else {
      this.eventService.createEvent(
        eventImages!,
        eventTitle!,
        eventDescription!,
        eventOwner!,
        eventPlaces!,
        eventGroups!,
        days,
        eventTags!
      );
    }
  }

  onDateRange() {
    if (this.eventRange.value === null) {
      return;
    }
    this.eventForm.controls.eventDays.clear();

    this.eventRange.value.forEach((date) => {
      this.eventForm.controls.eventDays.push(
        new FormGroup({
          auditory: new FormControl<Auditory | null>(null, [
            Validators.required,
          ]),
          date: new FormControl<Date | null>(date, [Validators.required]),
        })
      );
    });
  }
}

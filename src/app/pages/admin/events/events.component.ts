import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { addDays, getHours, getMinutes } from 'date-fns';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  distinctUntilChanged,
  filter,
  merge,
  pipe,
  skipWhile,
  take,
} from 'rxjs';
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

  form = new FormGroup({
    eventTitle: new FormControl<string | null>('', [Validators.required]),
    eventDescription: new FormControl<string | null>('', [Validators.required]),
    eventOwner: new FormControl<User | null>(null, [Validators.required]),
    eventPlaces: new FormControl<number | null>(1, [Validators.required]),
    eventGroups: new FormControl<Group[] | null>(null, [Validators.required]),
    eventTags: new FormControl<EventTag[] | null>(null, [Validators.required]),
    eventPeopleWillCome: new FormControl<User[] | null>(null),
    eventPeopleCame: new FormControl<User[] | null>(null),
    eventImages: new FormControl<File[] | null>(null),
    eventDays: new FormArray<
      FormGroup<{
        auditory: FormControl<Auditory | null>;
        date: FormControl<Date | null>;
      }>
    >([], [Validators.required]),
  });

  getAllEventsResponce$ = this.eventService.getAllEventsResponce$;

  deleteEventResponce$ = this.eventService.deleteEventResponce$;

  updateEventResponce$ = this.eventService.updateEventResponce$;

  createEventResponce$ = this.eventService.createEventResponce$;

  eventRange: FormControl<Date[] | null>;

  previewImagesUrls: SafeUrl[] | undefined;

  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly auditoryService: AuditoryService,
    private readonly eventTagsService: EventTagService,
    private readonly groupsService: GroupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,

    private domSanitizer: DomSanitizer
  ) {
    eventService.events$.subscribe((events) => {
      this.events = events;
    });
    userService.allUsers$.subscribe((users) => {
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

    this.eventRange = new FormControl<[Date, Date] | null>(null, [
      Validators.required,
    ]);

    this.eventRange.valueChanges
      .pipe(pipe(filter((value) => Boolean(value))))
      .subscribe((dates) => {
        if (dates === null) {
          return;
        }
        this.form.controls.eventDays.clear();

        dates.forEach((date) => {
          this.form.controls.eventDays.push(
            new FormGroup({
              auditory: new FormControl<Auditory | null>(null, [
                Validators.required,
              ]),
              date: new FormControl<Date | null>(date, [Validators.required]),
            })
          );
        });
      });

    merge(this.createEventResponce$, this.updateEventResponce$)
      .pipe(distinctUntilChanged())
      .subscribe((status) => {
        if (status === 'pending') {
          this.form.disable();
        } else {
          this.form.enable();
        }
      });
  }

  deleteEvent(event: Event) {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите данные о мероприятии?',
      accept: () => {
        this.eventService.deleteEvent(event);

        this.deleteEventResponce$
          .pipe(
            skipWhile((responce) => responce === 'pending'),
            take(1)
          )
          .subscribe((responce) => {
            if (responce === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Данные о мероприятии удалены',
              });
            }
          });
      },
    });
  }

  editEvent(event: Event) {
    this.idEditing = event.id;
    this.isEditing = true;
    this.formDialog = true;
    this.form.reset();
    this.previewImagesUrls = event.images;
    this.form.patchValue({
      eventDays: [],
      eventDescription: event.description,
      eventGroups: event.groups,
      eventOwner: this.allUsers.find((u) => u.id === event.owner.id),
      eventPlaces: event.places,
      eventTags: event.tags.map(
        (t) => this.allEventTags.find((allT) => allT.id === t.id)!
      ),
      eventTitle: event.title,
      eventImages: null,
      eventPeopleWillCome: event.peopleWillCome.map(
        (u) => this.allUsers.find((allU) => allU.id === u.id)!
      ),
      eventPeopleCame: event.peopleCame.map(
        (u) => this.allUsers.find((allU) => allU.id === u.id)!
      ),
    });

    this.eventRange.setValue(event.days.map((d) => new Date(d.date)));

    this.form.controls.eventDays.controls.forEach((control, index) => {
      control.controls.auditory.patchValue(
        this.allAuditories.find((a) => a.id === event.days[index].auditory.id)!
      );
      control.controls.date.patchValue(new Date(event.days[index].date));
    });
  }

  getFormsControls(): FormArray {
    return this.form.controls.eventDays as FormArray;
  }

  openAddDialog() {
    this.formDialog = true;
  }

  closeDialog() {
    this.formDialog = false;
  }

  handleFileChange(event: any) {
    this.form.patchValue({ eventImages: Array.from(event.target.files) });
    if (this.form.value.eventImages) {
      this.previewImagesUrls = this.form.value.eventImages.map((f) =>
        this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(f))
      );
    }
  }

  onSubmitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const days: EventDay[] = [];
    this.form.controls.eventDays.value.forEach((value, i) => {
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
      eventPeopleCame,
      eventPeopleWillCome,
    } = this.form.value;

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
        eventTags!,
        eventPeopleCame!,
        eventPeopleWillCome!
      );
      this.updateEventResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          if (responce === 'success') {
            this.formDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные о мероприятии добавлены',
            });
          }
        });
    } else {
      this.eventService.createEvent(
        eventImages!,
        eventTitle!,
        eventDescription!,
        eventOwner!,
        eventPlaces!,
        eventGroups!,
        days,
        eventTags!,

        eventPeopleCame!,
        eventPeopleWillCome!
      );
      this.createEventResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          if (responce === 'success') {
            this.formDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные о мероприятии обновлены',
            });
          }
        });
    }
  }
}

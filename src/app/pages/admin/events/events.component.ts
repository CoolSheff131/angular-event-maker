import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { addDays, differenceInDays } from 'date-fns';
import { Event } from 'src/app/api/interfaces/event.interface';
import { EventTag } from 'src/app/api/interfaces/eventTag.interface';
import { Group } from 'src/app/api/interfaces/group.interface';
import { EventService } from 'src/app/pages/admin/services/event.service';
import { convertDateToString } from 'src/app/utils/convert-date-to-string';
import { Auditory } from '../../../api/interfaces/auditory.interface';
import { AuditoryService } from '../services/auditory.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class AdminEventsComponent implements OnInit {
  addDialog = false;

  auditoryName = new FormControl<string>('');
  events: Event[] = [];

  eventName: FormControl<string | null>;
  eventDescription: FormControl<string | null>;
  eventPlaces: FormControl<number | null>;
  eventGroups: FormControl<Group[] | null>;
  eventTags: FormControl<EventTag[] | null>;
  eventImages: FormControl<File[] | null>;
  eventRange: FormControl<[Date, Date | null] | null>;
  days: number[] = [];
  previewImagesUrls: SafeUrl[] | undefined;
  images: undefined | FileList;

  constructor(
    private readonly eventService: EventService,
    private domSanitizer: DomSanitizer
  ) {
    eventService.events$.subscribe((auditories) => {
      this.events = auditories;
    });

    this.eventName = new FormControl<string | null>('');
    this.eventDescription = new FormControl<string | null>('');
    this.eventPlaces = new FormControl<number | null>(null);
    this.eventGroups = new FormControl<Group[] | null>(null);
    this.eventTags = new FormControl<EventTag[] | null>(null);
    this.eventImages = new FormControl<File[] | null>(null);
    this.eventRange = new FormControl<[Date, Date] | null>(null);
  }
  ngOnInit(): void {
    this.eventService.getEvents();
  }

  openAddDialog() {
    this.addDialog = true;
  }

  closeAddDialog() {
    this.addDialog = false;
  }

  getDayFromStart(dayNumber: number) {
    if (this.eventRange.value === null) {
      return;
    }
    const [dateStart] = this.eventRange.value;
    const date = addDays(dateStart, dayNumber);

    return convertDateToString(date);
  }

  handleFileChange(event: any) {
    this.images = event.target.files;
    if (this.images) {
      this.previewImagesUrls = Array.from(this.images).map((f) =>
        this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(f))
      );
    }
  }
  onSubmit() {
    console.log(this.eventImages.value);
  }

  onDateRange() {
    if (this.eventRange.value === null) {
      return;
    }
    const [dateStart, dateEnd] = this.eventRange.value;
    console.log(dateStart);
    console.log(dateEnd);
    if (dateEnd) {
      const dayCount = differenceInDays(dateEnd, dateStart);
      console.log(dayCount);

      this.days = new Array(dayCount);
      console.log(this.days);
    } else {
      this.days = [];
    }
  }

  onSubmitAuditory() {
    if (!this.auditoryName.value?.trim()) {
      return;
    }
    console.log(this.auditoryName.value);
    this.eventService.createEvent(this.auditoryName.value);
  }
}

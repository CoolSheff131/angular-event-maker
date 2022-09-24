import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Event } from '../api/interfaces/event.interface';
import { EventTag } from '../api/interfaces/eventTag.interface';
import { Group } from '../api/interfaces/group.interface';
import differenceInDays from 'date-fns/differenceInDays';
import addDays from 'date-fns/addDays';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
})
export class EventCreateComponent implements OnInit {
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

  cities: City[];

  selectedCities: City[] = [];

  constructor(private domSanitizer: DomSanitizer) {
    this.eventName = new FormControl<string | null>('');
    this.eventDescription = new FormControl<string | null>('');
    this.eventPlaces = new FormControl<number | null>(null);
    this.eventGroups = new FormControl<Group[] | null>(null);
    this.eventTags = new FormControl<EventTag[] | null>(null);
    this.eventImages = new FormControl<File[] | null>(null);
    this.eventRange = new FormControl<[Date, Date] | null>(null);

    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
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

  getDayFromStart(dayNumber: number) {
    if (this.eventRange.value === null) {
      return;
    }
    const [dateStart] = this.eventRange.value;
    console.log(dateStart);
    const s = addDays(dateStart, dayNumber);
    console.log(s);

    return `${s.getDate()}.${s.getMonth()}.${s.getFullYear()}`;
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
  ngOnInit(): void {}
}

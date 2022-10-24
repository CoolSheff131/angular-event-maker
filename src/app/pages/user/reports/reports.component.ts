import { Component } from '@angular/core';
import { format } from 'date-fns';
import { Event } from 'src/app/api/interfaces/event.interface';
import { EventService } from '../../admin/services/event.service';

@Component({
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  basicData: any;

  basicOptions: any;
  events: Event[] = [];

  constructor(private readonly eventService: EventService) {}

  ngOnInit() {
    this.eventService.events$.subscribe((events) => {
      this.events = events;
      const labels = events.map((e) => e.title);
      const peopleCame = events.map((e) => e.peopleCame.length);
      const peopleWillCome = events.map((e) => e.peopleWillCome.length);

      this.basicData = {
        labels,
        datasets: [
          {
            label: 'Пришли',
            backgroundColor: '#42A5F5',
            data: peopleCame,
          },
          {
            label: 'Участники',
            backgroundColor: '#FFA726',
            data: peopleWillCome,
          },
        ],
      };
    });

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: 'black',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'black',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
        y: {
          ticks: {
            color: 'black',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
      },
    };
  }
}

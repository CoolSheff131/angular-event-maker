import { Component } from '@angular/core';
import { format } from 'date-fns';
import { EventService } from '../../admin/services/event.service';

@Component({
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  basicData: any;

  basicOptions: any;

  constructor(private readonly eventService: EventService) {}

  ngOnInit() {
    this.eventService.events$.subscribe((events) => {
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
            color: '#ebedef',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
        y: {
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
      },
    };
  }
}

import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { ApiService } from '../../../api/api.service';
import { Group } from '../../../api/interfaces/group.interface';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private groups = new Subject<Group[]>();

  groups$ = this.groups.asObservable();
  constructor(private readonly apiService: ApiService) {}

  createGroup(value: string) {
    this.apiService
      .createGroup(value)
      .pipe(tap(() => this.getGroups()))
      .subscribe();
  }
  getGroups() {
    this.apiService.getGroups().subscribe({
      next: (groups) => {
        this.groups.next(groups);
      },
    });
  }
}

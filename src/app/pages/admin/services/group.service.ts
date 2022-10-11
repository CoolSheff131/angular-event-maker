import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { ApiService } from '../../../api/api.service';
import { Group } from '../../../api/interfaces/group.interface';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private groups = new BehaviorSubject<Group[]>([]);

  groups$ = this.groups.asObservable();

  constructor(private readonly apiService: ApiService) {
    this.getGroups();
  }

  createGroup(groupName: string) {
    this.apiService
      .createGroup({ id: '', name: groupName })
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

  deleteGroup(group: Group) {
    this.apiService
      .deleteGroup(group.id)
      .pipe(tap(() => this.getGroups()))
      .subscribe();
  }
  updateGroup(id: string, groupName: string) {
    this.apiService
      .updateGroup(id, { name: groupName })
      .pipe(tap(() => this.getGroups()))
      .subscribe();
  }
}

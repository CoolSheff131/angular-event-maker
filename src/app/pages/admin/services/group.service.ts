import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { ApiService, ResponceStatus } from '../../../api/api.service';
import { Group } from '../../../api/interfaces/group.interface';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private deleteGroupResponce = new BehaviorSubject<ResponceStatus>('none');
  private createGroupResponce = new BehaviorSubject<ResponceStatus>('none');
  private updateGroupResponce = new BehaviorSubject<ResponceStatus>('none');
  private getAllGroupsResponce = new BehaviorSubject<ResponceStatus>('none');

  deleteGroupResponce$ = this.deleteGroupResponce.asObservable();
  createGroupResponce$ = this.createGroupResponce.asObservable();
  updateGroupResponce$ = this.updateGroupResponce.asObservable();
  getAllGroupsResponce$ = this.getAllGroupsResponce.asObservable();

  private groups = new BehaviorSubject<Group[]>([]);

  groups$ = this.groups.asObservable();

  constructor(private readonly apiService: ApiService) {
    this.getGroups();
  }

  createGroup(groupName: string) {
    this.createGroupResponce.next('pending');
    this.apiService
      .createGroup({ id: '', name: groupName })
      .pipe(tap(() => this.getGroups()))
      .subscribe({
        next: () => {
          this.createGroupResponce.next('success');
        },
        error: () => {
          this.createGroupResponce.next('error');
        },
      });
  }

  getGroups() {
    this.apiService.getGroups().subscribe({
      next: (groups) => {
        this.groups.next(groups);
      },
    });
  }

  deleteGroup(group: Group) {
    this.deleteGroupResponce.next('pending');

    this.apiService
      .deleteGroup(group.id)
      .pipe(tap(() => this.getGroups()))
      .subscribe({
        next: () => {
          this.deleteGroupResponce.next('success');
        },
        error: () => {
          this.deleteGroupResponce.next('error');
        },
      });
  }
  updateGroup(id: string, groupName: string) {
    this.updateGroupResponce.next('pending');

    this.apiService
      .updateGroup(id, { name: groupName })
      .pipe(tap(() => this.getGroups()))
      .subscribe({
        next: () => {
          this.updateGroupResponce.next('success');
        },
        error: () => {
          this.updateGroupResponce.next('error');
        },
      });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { ApiService, ResponceStatus } from '../../../api/api.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';

@Injectable({ providedIn: 'root' })
export class AuditoryService {
  private deleteAuditoryResponce = new Subject<ResponceStatus>();
  private createAuditoryResponce = new Subject<ResponceStatus>();
  private updateAuditoryResponce = new Subject<ResponceStatus>();
  private getAllAuditoriesResponce = new Subject<ResponceStatus>();

  deleteAuditoryResponce$ = this.deleteAuditoryResponce.asObservable();
  createAuditoryResponce$ = this.createAuditoryResponce.asObservable();
  updateAuditoryResponce$ = this.updateAuditoryResponce.asObservable();
  getAllAuditoriesResponce$ = this.getAllAuditoriesResponce.asObservable();

  private auditories = new BehaviorSubject<Auditory[]>([]);
  auditories$ = this.auditories.asObservable();

  constructor(private readonly apiService: ApiService) {
    this.getAuditories();
  }

  createAuditory(auditoryName: string) {
    this.createAuditoryResponce.next('pending');

    this.apiService
      .createAuditory({ id: '', name: auditoryName })
      .pipe(tap(() => this.getAuditories()))
      .subscribe({
        next: () => {
          this.createAuditoryResponce.next('success');
        },
        error: () => {
          this.createAuditoryResponce.next('error');
        },
      });
  }

  getAuditories() {
    this.getAllAuditoriesResponce.next('pending');
    this.apiService.getAuditories().subscribe({
      next: (groups) => {
        this.auditories.next(groups);
        this.getAllAuditoriesResponce.next('success');
      },
      error: () => {
        this.getAllAuditoriesResponce.next('error');
      },
    });
  }
  deleteAuditory(auditory: Auditory) {
    this.deleteAuditoryResponce.next('pending');
    this.apiService
      .deleteAuditory(auditory.id)
      .pipe(tap(() => this.getAuditories()))
      .subscribe({
        next: () => {
          this.deleteAuditoryResponce.next('success');
        },
        error: () => {
          this.deleteAuditoryResponce.next('error');
        },
      });
  }
  updateAuditory(auditoryToEditId: string, auditoryName: string) {
    this.updateAuditoryResponce.next('pending');
    this.apiService
      .updateAuditory(auditoryToEditId, { name: auditoryName })
      .pipe(tap(() => this.getAuditories()))
      .subscribe({
        next: () => {
          this.updateAuditoryResponce.next('success');
        },
        error: () => {
          this.updateAuditoryResponce.next('error');
        },
      });
  }
}

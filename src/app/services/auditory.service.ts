import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Auditory } from '../api/interfaces/auditory.interface';

@Injectable({ providedIn: 'root' })
export class AuditoryService {
  private auditories = new Subject<Auditory[]>();

  auditories$ = this.auditories.asObservable();
  constructor(private readonly apiService: ApiService) {}

  getAuditories() {
    this.apiService.getAuditories().subscribe({
      next: (auditories) => {
        this.auditories.next(auditories);
      },
    });
  }

  createAuditory(auditoryName: string) {
    this.apiService
      .createAuditory(auditoryName)
      .pipe(tap(() => this.getAuditories()))
      .subscribe();
  }
}

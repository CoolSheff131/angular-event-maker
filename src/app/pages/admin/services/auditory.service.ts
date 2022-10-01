import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { ApiService } from '../../../api/api.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';

@Injectable({ providedIn: 'root' })
export class AuditoryService {
  private auditories = new Subject<Auditory[]>();

  auditories$ = this.auditories.asObservable();
  constructor(private readonly apiService: ApiService) {}

  createAuditory(auditoryName: string) {
    this.apiService
      .createAuditory({ id: '', name: auditoryName })
      .pipe(tap(() => this.getAuditories()))
      .subscribe();
  }

  getAuditories() {
    this.apiService.getGroups().subscribe({
      next: (groups) => {
        this.auditories.next(groups);
      },
    });
  }
}

import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { ApiService } from '../../../api/api.service';
import { Auditory } from '../../../api/interfaces/auditory.interface';

@Injectable({ providedIn: 'root' })
export class AuditoryService {
  deleteAuditory(auditory: Auditory) {
    this.apiService
      .deleteAuditory(auditory.id)
      .pipe(tap(() => this.getAuditories()))
      .subscribe();
  }
  updateAuditory(auditoryToEditId: string, auditoryName: string) {
    this.apiService
      .updateAuditory(auditoryToEditId, { name: auditoryName })
      .pipe(tap(() => this.getAuditories()))
      .subscribe();
  }
  private auditories = new Subject<Auditory[]>();

  auditories$ = this.auditories.asObservable();
  constructor(private readonly apiService: ApiService) {
    this.getAuditories();
  }

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

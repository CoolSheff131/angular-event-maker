import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class EventTagService {
  constructor(private readonly apiService: ApiService) {}
}

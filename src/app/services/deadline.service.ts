import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { retry } from 'rxjs/internal/operators/retry';
import { of } from 'rxjs';
import { DeadlineResponse } from '../Models/DeadlineResponse';

@Injectable({
  providedIn: 'root',
})
export class DeadlineService {
  private apiUrl = '/api/deadline';

  constructor(private readonly http: HttpClient) {}

  getEndpointData(): Observable<DeadlineResponse> {
    // return this.http.get<DeadlineResponse>(this.apiUrl).pipe(
    return of({ secondsLeft: 12 }).pipe(
      // simulating API response for testing
      retry(2)
    );
  }
}

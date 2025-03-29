import {
  Component,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
  OnDestroy,
  OnInit,
  DestroyRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DeadlineService } from '../../services/deadline.service';

import { CountdownStatus } from '../../Models/CountdownStatus.enum';
import { DeadlineResponse } from '../../Models/DeadlineResponse';

@Component({
  selector: 'app-deadline-countdown',
  imports: [CommonModule],
  templateUrl: './deadline-countdown.component.html',
  styleUrl: './deadline-countdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeadlineCountdownComponent implements OnInit, OnDestroy {
  constructor(private readonly deadlineService: DeadlineService) {}
  private readonly destroyRef = inject(DestroyRef);

  status: WritableSignal<CountdownStatus> = signal(CountdownStatus.Loading);
  secondsLeft: WritableSignal<number | null> = signal(null);
  errorMessage: WritableSignal<string | null> = signal(null);

  get CountdownStatus() {
    return CountdownStatus;
  }

  private intervalInstance: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.loadDeadline();
  }

  private loadDeadline(): void {
    this.clearTimer();
    this.status.set(CountdownStatus.Loading);

    this.deadlineService
      .getEndpointData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.handleResponse(res);
        },
        error: (err) => {
          this.handleError(err);
        },
      });
  }

  private handleResponse(res: DeadlineResponse): void {
    if (res.secondsLeft <= 0) {
      this.secondsLeft.set(0);
      this.status.set(CountdownStatus.Finished);
    } else {
      this.secondsLeft.set(res.secondsLeft);
      this.status.set(CountdownStatus.Running);
      this.startTimer();
    }
  }

  private handleError(err: any): void {
    console.error('Failed to load initial seconds:', err);
    this.errorMessage.set(
      err?.message || 'Failed to load deadline information.'
    );
    this.status.set(CountdownStatus.Error);
  }

  private startTimer(): void {
    if (this.intervalInstance) return; // make sure one timer instance

    this.intervalInstance = setInterval(() => {
      // updatinng the signal value for countdown
      this.secondsLeft.update((currentSeconds) => {
        if (currentSeconds === null || currentSeconds <= 1) {
          this.clearTimer(); // Stop interval
          this.status.set(CountdownStatus.Finished);
          return 0;
        }
        return --currentSeconds;
      });
    }, 1000);
  }

  private clearTimer(): void {
    if (this.intervalInstance) {
      clearInterval(this.intervalInstance);
      this.intervalInstance = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }
}

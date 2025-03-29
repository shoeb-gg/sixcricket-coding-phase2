import { Component } from '@angular/core';
import { DeadlineCountdownComponent } from './components/deadline-countdown/deadline-countdown.component';

@Component({
  selector: 'app-root',
  imports: [DeadlineCountdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'sixcricket-coding-phase2';
}

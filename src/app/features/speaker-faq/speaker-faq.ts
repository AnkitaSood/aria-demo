import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-speaker-faq',
  templateUrl: './speaker-faq.html',
  styleUrl: './speaker-faq.css',
})
export class SpeakerFaqComponent {
  panel1Open = signal(false);
  panel2Open = signal(false);

  toggle(panel: 1 | 2): void {
    if (panel === 1) {
      this.panel1Open.set(!this.panel1Open());
      this.panel2Open.set(false);
    } else {
      this.panel2Open.set(!this.panel2Open());
      this.panel1Open.set(false);
    }
  }
}

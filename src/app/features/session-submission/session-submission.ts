import { Component, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { SpeakerFaqComponent } from '../speaker-faq/speaker-faq';

interface SessionSubmission {
  speakerName: string;
  talkTrack: string;
  coSpeaker: string;
}

@Component({
  selector: 'app-session-submission',
  imports: [SpeakerFaqComponent, FormField],
  templateUrl: './session-submission.html',
  styleUrl: './session-submission.css',
})
export class SessionSubmissionComponent {
  readonly model = signal<SessionSubmission>({
    speakerName: '',
    talkTrack: '',
    coSpeaker: '',
  });

  readonly sessionForm = form(this.model, (path) => {
    required(path.speakerName, { message: 'Speaker name is required' });
    required(path.talkTrack, { message: 'Talk track is required' });
  });

  readonly submitted = signal(false);

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.sessionForm, {
      action: async () => {
        console.log('Session submitted:', this.model());
        this.submitted.set(true);
      },
    });
  }
}

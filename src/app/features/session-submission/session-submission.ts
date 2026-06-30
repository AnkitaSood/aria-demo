import { Component, computed, effect, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { SpeakerFaqComponent } from '../speaker-faq/speaker-faq';

interface SessionSubmission {
  speakerName: string;
  talkTrack: string;
  coSpeaker: string;
}

const ALL_TRACKS = [
  'Frontend', 'Backend', 'DevOps', 'AI/ML',
  'Accessibility', 'Architecture', 'Testing',
  'Career', 'Design Systems',
];

@Component({
  selector: 'app-session-submission',
  imports: [
    SpeakerFaqComponent,
    FormField,
    Combobox,
    ComboboxPopup,
    ComboboxWidget,
    Listbox,
    Option,
  ],
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

  /** Tracks the current text in the combobox input for filtering */
  readonly trackQuery = signal('');

  /** Tracks the selected value from the listbox */
  readonly selectedTrack = signal<string[]>([]);

  readonly filteredTracks = computed(() => {
    const query = this.trackQuery().toLowerCase();
    if (!query) return ALL_TRACKS;
    return ALL_TRACKS.filter((t) => t.toLowerCase().includes(query));
  });

  constructor() {
    // Single write path: trackQuery is the source of truth for the input value.
    // This effect keeps model.talkTrack in sync with whatever the user has typed.
    effect(() => {
      const query = this.trackQuery();
      this.model.update((m) => ({ ...m, talkTrack: query }));
    });

    // When the user selects a track from the listbox, update trackQuery.
    // The effect above will then propagate the value to model.talkTrack.
    effect(() => {
      const selected = this.selectedTrack();
      if (selected.length > 0) {
        this.trackQuery.set(selected[0]);
      }
    });
  }

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

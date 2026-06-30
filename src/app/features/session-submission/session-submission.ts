import { Component, computed, effect, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { SpeakerFaqComponent } from '../speaker-faq/speaker-faq';
import { SpeakerFaqMaterialComponent } from '../speaker-faq-material/speaker-faq-material';

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

const SESSION_FORMATS = [
  'Lightning Talk', 'Workshop', 'Panel', 'Live Coding',
  'Fireside Chat', 'Keynote', 'Birds of a Feather', 'Office Hours',
];

@Component({
  selector: 'app-session-submission',
  imports: [
    SpeakerFaqComponent,
    SpeakerFaqMaterialComponent,
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

  /** Tracks the selected value from the listbox (talkTrack) */
  readonly selectedTrack = signal<string[]>([]);

  readonly filteredTracks = computed(() => {
    const query = this.trackQuery().toLowerCase();
    if (!query) return ALL_TRACKS;
    return ALL_TRACKS.filter((t) => t.toLowerCase().includes(query));
  });

  /** Session format options for the select-only combobox */
  readonly formats = SESSION_FORMATS;

  /** Tracks the selected format from the combobox listbox */
  readonly selectedFormat = signal<string[]>([]);

  /** The display value shown in the format combobox trigger */
  readonly formatQuery = signal('');

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

    // When the user selects a format, write it to model.coSpeaker and update display.
    effect(() => {
      const selected = this.selectedFormat();
      const value = selected[0] ?? '';
      this.formatQuery.set(value);
      this.model.update((m) => ({ ...m, coSpeaker: value }));
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

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
    required(path.coSpeaker, { message: 'Session format is required' });
  });

  readonly submitted = signal(false);

  readonly trackQuery = signal('');

  readonly trackTouched = signal(false);

  /** Tracks the selected value from the listbox (talkTrack) */
  readonly selectedTrack = signal<string[]>([]);

  readonly filteredTracks = computed(() => {
    if (!this.isFilteringTracks()) return ALL_TRACKS;
    const query = this.trackQuery().toLowerCase();
    if (!query) return ALL_TRACKS;
    return ALL_TRACKS.filter((t) => t.toLowerCase().includes(query));
  });

  /** Controls visibility of the talk-track autocomplete popup */
  readonly isTrackExpanded = signal(false);

  /** True once the user has typed into the talk-track input; reset on focus so
   *  focusing always shows the full list before any filtering begins. */
  readonly isFilteringTracks = signal(false);

  /** Controls visibility of the session-format popup */
  readonly isFormatExpanded = signal(false);

  /** Session format options for the select-only combobox */
  readonly formats = SESSION_FORMATS;

  /** Tracks the selected format from the combobox listbox */
  readonly selectedFormat = signal<string[]>([]);

  /** The display value shown in the format combobox trigger */
  readonly formatQuery = signal('');

  readonly formatTouched = signal(false);

  removeTrack(track: string): void {
    this.selectedTrack.update((tracks) => tracks.filter((t) => t !== track));
  }

  constructor() {
    // Multi-select write path: joins all selected tracks for the model.
    // trackQuery is NOT written here — the input stays clear for filtering.
    effect(() => {
      const selected = this.selectedTrack();
      this.model.update((m) => ({ ...m, talkTrack: selected.join(', ') }));
    });

    // When the user selects a format, write it to model.coSpeaker and update display.
    effect(() => {
      const selected = this.selectedFormat();
      const value = selected[0] ?? '';
      this.formatQuery.set(value);
      this.model.update((m) => ({ ...m, coSpeaker: value }));
      if (value) this.isFormatExpanded.set(false);
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

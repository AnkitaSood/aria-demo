# Branch: 04-signal-form-shell

## What changed
SessionSubmissionComponent now has a working Signal Form. Three fields: speakerName (plain
input + required), talkTrack (plain input + required), coSpeaker (plain input, no validation).
Submit calls `submit(sessionForm, { action })` — logs value to console. Inline confirmation
banner on success.

## What to say
"Before we add @angular/aria's autocomplete and combobox, let's wire the form. Signal Forms
gives us a reactive model — a signal that holds the form data — and a schema function where
we declare validation rules. No FormGroup, no AbstractControl. Just a signal and a function."

[Show the .ts file]

"The schema function receives `path` — a SchemaPathTree. We call `required(path.speakerName)`
to bind a required rule to that field. The template binds with `[formField]='sessionForm.speakerName'`
— no two-way binding, no `ngModel`, no formControlName. The directive reads and writes
the signal directly."

## Keyboard demo sequence
1. Navigate to /submit
2. Tab to Speaker Name, leave empty, Tab away — error appears: "Speaker name is required"
3. Fill Speaker Name, Tab to Talk Track, leave empty, Tab away — error appears
4. Fill Talk Track — Submit button becomes enabled
5. Submit — console shows `{ speakerName: '...', talkTrack: '...', coSpeaker: '' }`
6. Success banner appears with role="status" — screen reader announces it

# Design: DevConf Companion — "Accessible by Default" Demo App

**Date:** 2026-06-30
**Status:** Approved
**PRD:** `prd-accessible-by-default-demo_2.md`

---

## Goal

Build one cohesive Angular 22 demo app that proves `@angular/aria` gives you accessible, keyboard-navigable, screen-reader-correct components with your own markup and CSS — no third-party component library, no Tailwind, no extra bundle weight. Delivered as a sequence of 8 git branches, each a fully working checkpoint the speaker can `git checkout` to during a 25-minute conference talk.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Angular 22, standalone, zoneless (`provideZonelessChangeDetection`) |
| ARIA primitives | `@angular/aria` — `menu`, `autocomplete`, `combobox`, `listbox`, `accordion` |
| Overlay | `@angular/cdk/overlay` (menubar popup + combobox popup) |
| Forms | `@angular/forms/signals` — `form`, `Field`, `required`, `submit` |
| Material | `@angular/material/expansion` + CDK — **branch 07 only** |
| CSS | CSS custom properties (`tokens.css`) + one `.css` per component, no Tailwind |
| Routing | `provideRouter` — two routes: `/` and `/submit` |
| Build | `@angular/build` (esbuild, already configured) |

---

## Routing

```
/          → AppShellComponent  (menubar always visible, empty default view)
/submit    → SessionSubmissionComponent  (form + FAQ accordion)
```

`AppShellComponent` wraps every view. `<router-outlet>` lives inside it. The menubar's **File → New Submission** item navigates to `/submit`.

---

## File structure (final state, branch 07)

```
src/
  styles/
    tokens.css                   ← :root custom properties
    global.css                   ← resets, box-sizing, base typography
  app/
    app.ts / app.html / app.css
    shell/
      app-shell.ts
      app-shell.html
      app-shell.css
    features/
      session-submission/
        session-submission.ts
        session-submission.html
        session-submission.css
      speaker-faq/
        speaker-faq.ts
        speaker-faq.html
        speaker-faq.css
      speaker-faq-material/      ← branch 07 only
        speaker-faq-material.ts
        speaker-faq-material.html
NARRATION.md                     ← repo root, updated per branch
BUNDLE_SIZES.md                  ← repo root, added in branch 07
```

---

## CSS token system

```css
:root {
  /* Color */
  --color-surface: #1a1a2e;
  --color-surface-elevated: #16213e;
  --color-surface-active: #0f3460;
  --color-border: #2a2a4a;
  --color-text: #e0e0f0;
  --color-text-muted: #8888aa;
  --color-accent: #e94560;
  --color-focus-ring: #4fc3f7;

  /* Space (4px scale) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;

  /* Motion */
  --duration-fast: 150ms;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Component CSS files target `@angular/aria` state attributes directly — no custom state classes:

```css
[ngAccordionTrigger][aria-expanded='true'] { color: var(--color-accent); }
[ngAccordionTrigger]:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
[ngMenuItem] button[aria-expanded='true'] { background: var(--color-surface-active); }
```

---

## Component designs

### AppShellComponent

Flat menubar — two top-level menus, no submenus built (submenus mentioned verbally).

**File menu:** New Submission (→ `/submit`), Save Draft, divider, Exit
**Help menu:** Keyboard Shortcuts, About `@angular/aria`

Directives: `ngMenuBar`, `ngMenuItem`, `ngMenuTrigger`, `ngMenu` from `@angular/aria/menu`; `@angular/cdk/overlay` for popup positioning.

### SessionSubmissionComponent

Signal Form with three fields:

| Field | Widget | Data |
|---|---|---|
| Speaker Name | plain `<input>` + `Field` | freeform |
| Talk Track | `ngAutocomplete` + `Field` | `['Frontend','Backend','DevOps','AI/ML','Accessibility','Architecture','Testing','Career','Design Systems']` |
| Co-speaker | `ngCombobox` + `ngListbox`/`ngOption` + `Field` | `['Lightning Talk','Workshop','Panel','Live Coding','Fireside Chat','Keynote','Birds of a Feather','Office Hours']` |

Submit wired to Signal Form `submit()` — logs value to console, shows inline confirmation. No backend.

```ts
readonly model = signal<SessionSubmission>({ speakerName: '', talkTrack: '', coSpeaker: '' });
readonly sessionForm = form(this.model, path => {
  required(path.speakerName);
  required(path.talkTrack);
});
```

### SpeakerFaqComponent

Two-panel accordion, `multiExpandable="false"`, inline DOM show/hide (not a popup — contrast with menubar overlay).

Panels:
1. "What format should my abstract be in?"
2. "How long is the demo slot?"

Directives: `ngAccordionGroup`, `ngAccordionItem`, `ngAccordionTrigger`, `ngAccordionPanel`, `ngAccordionContent` from `@angular/aria/accordion`.

### SpeakerFaqMaterialComponent (branch 07 only)

Same two FAQ panels, same content, built with `MatAccordion`/`MatExpansionPanel`. Material's default visual style — deliberately not forced into the token system so the visual contrast is obvious. Rendered directly beside the `@angular/aria` accordion.

---

## Branch sequence

All branches build linearly — each branches off the previous. `git diff <prev> <current>` = one clean teaching beat. Every branch must `npm install && npm start` cleanly.

| Branch | What's added | Speaker action |
|---|---|---|
| `00-scaffold` | Angular v22 upgrade + full file structure, plain HTML menubar, static `/submit` placeholder, all tokens/CSS finalized | "Looks done. Try tabbing." |
| `01-menubar-aria` | `@angular/aria/menu` + `@angular/cdk/overlay` wired into menubar | `git diff 00-scaffold 01-menubar-aria` → devtools → keyboard demo |
| `02-accordion-faq` | FAQ as plain `<div>`s + click handlers, no ARIA, no keyboard | "Same broken pattern, different widget" |
| `03-accordion-aria` | `@angular/aria/accordion`, `multiExpandable="false"`, fully styled | `git diff 02-accordion-faq 03-accordion-aria` → `aria-expanded` flips live |
| `04-signal-form-shell` | Signal Form scaffolded, `speakerName` plain input, other fields plain text inputs | Submit works end-to-end before ARIA widgets |
| `05-autocomplete` | `talkTrack` → `ngAutocomplete` wired into same form field | `aria-activedescendant` updates on arrow keys |
| `06-combobox` | `coSpeaker` → `ngCombobox` + `ngListbox`/`ngOption` | More wiring vs Autocomplete — "choose your primitive" moment |
| `07-material-comparison` | `MatAccordion` beside `@angular/aria` accordion; `@angular/material` dep added; `BUNDLE_SIZES.md` | Two accordions side by side, bundle numbers spoken aloud |
| `08-final-polish` *(optional)* | Focus-ring consistency, motion tokens | Cosmetic only — `07` is the complete demo-ready end state |

Each branch also gets a tag: `git tag demo/<branch-name>`.

---

## `NARRATION.md` format (repo root, fixed path)

Updated on every branch. Structure per branch:

```markdown
# Branch: <name>

## What changed
One paragraph.

## What to say
Speaker cue card — written in second person.

## Keyboard demo sequence
Numbered steps for the live keyboard walkthrough.
```

---

## `BUNDLE_SIZES.md` (added in branch 07)

Filled in after running `ng build --configuration production` on both `03-accordion-aria` and `07-material-comparison`. Re-captured before the talk if dependency versions shift.

---

## Angular upgrade path (pre-branch work, on `main`)

1. `ng update @angular/core@22 @angular/cli@22 @angular/cdk@22`
2. `npm install @angular/aria @angular/forms` (v22, Signal Forms stable)
3. Verify `npm start` — then branch `00-scaffold` is created

`@angular/material` is **not** installed here — deferred to `07-material-comparison` so the bundle delta is real.

---

## Build constraints

- Every branch must build and run without errors before it is considered done
- Visual output must be identical across `00`→`06` (CSS grows additively, no layout shifts)
- `@angular/material` and Material CDK added only on `07`
- No env vars, API keys, or network calls — fully offline
- One or two commits per branch — clean history
- `NARRATION.md` updated on every branch at repo root

---

## Out of scope

- No backend, persistence, or toast library — `submit()` logs to console
- No View menu, theme toggle, nested submenus (mentioned verbally)
- No Menu checkbox/radio items
- No Select, Tabs, Tree, Toolbar, Grid (name-dropped only)
- No router guards, lazy loading, or auth
- Branch `08-final-polish` is optional

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context

This is a **conference talk demo** for `@angular/aria`, a library that manages ARIA state and keyboard behavior while leaving CSS entirely to the developer. The app is structured as a series of git branches (00–08), each adding a new demo chapter. `NARRATION.md` contains speaker notes for the current branch and should be read before modifying demo content.

## Commands

```bash
ng serve           # dev server at http://localhost:4200
ng build           # production build (500 kB budget warning on branches 07–08 is intentional)
ng test            # run all tests with Karma
ng test --include='**/app.spec.ts'  # run a single spec file
```

Re-measure bundle sizes after dependency changes:
```bash
ng build --configuration production 2>&1 | grep -E "Initial|\.js|\.css"
```

## Architecture

The app is a single Angular 22 standalone application using **zoneless change detection** (`provideZonelessChangeDetection()`).

```
App (app.ts)
└── AppShellComponent (shell/app-shell)   — nav menubar + router outlet
    └── SessionSubmissionComponent        — route: /submit
        ├── SpeakerFaqComponent           — @angular/aria accordion
        └── SpeakerFaqMaterialComponent   — @angular/material accordion (comparison)
```

`app.routes.ts` only defines `/submit`; everything else redirects there.

### State management

`SessionSubmissionComponent` owns all state using Angular signals. There are no services. The form uses `@angular/forms/signals` (`form()`, `FormField`, `required`, `submit`), not `ReactiveFormsModule`. The combobox wiring follows a **single write path** pattern:

- `trackQuery` signal is the source of truth for the input value
- An `effect()` propagates `trackQuery → model.talkTrack`
- A second `effect()` propagates `selectedTrack → trackQuery` when a listbox item is chosen

### CSS conventions

All design tokens are in `src/styles/tokens.css` (colors, spacing, radii, durations). Global resets and `prefers-reduced-motion` collapse are in `src/styles/global.css`. Both are imported into `src/styles.css` alongside the Material prebuilt theme.

**The key styling pattern**: interactive state is driven by ARIA attributes, not custom classes. Example:
```css
[ngMenuTrigger][aria-expanded='true'] { background: var(--color-surface-active); }
```
This is intentional — it demonstrates `@angular/aria`'s value proposition. Do not introduce `.is-open` or similar classes.

Focus ring styling uses `--color-focus-ring` via the global `:focus-visible` rule. All new interactive elements should rely on this rather than component-level overrides.

### @angular/aria directive API

| Primitive | Directives |
|-----------|-----------|
| Menu | `ngMenuBar`, `ngMenuTrigger [menu]`, `ngMenu #ref`, `ngMenuItem` |
| Accordion | `ngAccordionGroup [multiExpandable]`, `ngAccordionTrigger [panel]`, `ngAccordionPanel #ref`, `ngAccordionContent` |
| Combobox | `ngCombobox`, `ngComboboxPopup [combobox] [popupType]`, `ngComboboxWidget`, `ngListbox`, `ngOption` |

`ngAccordionContent` is used inside `<ng-template>` for lazy rendering. `ngComboboxPopup` must also be inside `<ng-template>`.

### Testing

Tests use `provideZonelessChangeDetection()` and `provideRouter([])` in `TestBed`. There are no `NgModule`s — all components are standalone. Do not add `NgModule` imports to specs.

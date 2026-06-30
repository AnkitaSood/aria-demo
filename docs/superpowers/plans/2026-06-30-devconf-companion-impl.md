# DevConf Companion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the DevConf Companion Angular 22 demo app as 8 git branches (00-scaffold → 08-final-polish), each a self-contained conference talk checkpoint demonstrating `@angular/aria` primitives.

**Architecture:** `AppShellComponent` wraps every route via `<router-outlet>`; the root `App` component simply renders `<app-shell />`. Two routes: `/` (empty landing) and `/submit` (SessionSubmissionComponent containing the Signal Form + SpeakerFaqComponent side by side). All branches build linearly — each branches off the previous and is tagged `demo/<branch-name>`.

**Tech Stack:** Angular 22 (standalone, zoneless), `@angular/aria` (menu/accordion/autocomplete/combobox/listbox), `@angular/cdk/overlay`, `@angular/forms/signals`, CSS custom properties (no Tailwind), `@angular/build` (esbuild).

## Global Constraints

- Angular 22 — all `@angular` packages pinned to `^22.0.0`
- Standalone components only — no NgModule
- Zoneless — `provideZonelessChangeDetection()` already in `app.config.ts`; do not remove
- One `.css` file per component; global tokens in `src/styles/tokens.css` imported by `src/styles.css`
- Style ARIA state with attribute selectors only — `[aria-expanded='true']`, `[ngAccordionTrigger]` etc. — no custom `.is-open` classes
- `NARRATION.md` at repo root — updated on every branch
- No backend, no API calls, no environment variables — fully offline
- `@angular/material` added only in branch 07 — not before
- Every branch: `npm start` and `ng build` must complete without errors
- Commit message format: `feat: <description> [branch-name]`
- Tag format: `git tag demo/<branch-name>` after final commit on each branch

---

## File Map (final state after branch 07)

| File | Created in | Responsibility |
|------|-----------|----------------|
| `src/styles/tokens.css` | 00-scaffold | CSS custom properties (:root) |
| `src/styles/global.css` | 00-scaffold | resets, box-sizing, base typography |
| `src/styles.css` | 00-scaffold | `@import` both above |
| `src/app/app.ts` | 00-scaffold | root component — renders `<app-shell />` |
| `src/app/app.html` | 00-scaffold | `<app-shell />` |
| `src/app/app.routes.ts` | 00-scaffold | two routes: `/` and `/submit` |
| `src/app/shell/app-shell.ts` | 00-scaffold | AppShellComponent — menubar + router-outlet |
| `src/app/shell/app-shell.html` | 00-scaffold | menubar HTML + `<router-outlet>` |
| `src/app/shell/app-shell.css` | 00-scaffold | menubar styles (token-driven) |
| `src/app/features/session-submission/session-submission.ts` | 00-scaffold | layout shell; grows each branch |
| `src/app/features/session-submission/session-submission.html` | 00-scaffold | two-column layout |
| `src/app/features/session-submission/session-submission.css` | 00-scaffold | layout styles |
| `src/app/features/speaker-faq/speaker-faq.ts` | 00-scaffold | SpeakerFaqComponent placeholder |
| `src/app/features/speaker-faq/speaker-faq.html` | 00-scaffold | static FAQ text |
| `src/app/features/speaker-faq/speaker-faq.css` | 00-scaffold | FAQ styles |
| `src/app/features/speaker-faq-material/speaker-faq-material.ts` | 07-material-comparison | MatAccordion version |
| `src/app/features/speaker-faq-material/speaker-faq-material.html` | 07-material-comparison | MatAccordion template |
| `NARRATION.md` | 00-scaffold (updated each branch) | speaker cue cards |
| `BUNDLE_SIZES.md` | 07-material-comparison | production build size comparison |

---

## Task 0: Angular Upgrade + Dependency Install (on `main`)

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (auto-generated)
- Reference: `node_modules/@angular/aria/*/index.d.ts` (read after install to verify API)

**Interfaces:**
- Produces: Angular 22 workspace, `@angular/aria` and `@angular/cdk` installed, `npm start` green

- [ ] **Step 1: Check current branch and status**

```bash
git branch --show-current
git status
```

Expected: `main`, clean working tree.

- [ ] **Step 2: Run ng update to Angular 22**

```bash
npx @angular/cli update @angular/core@22 @angular/cli@22 --allow-dirty
```

Expected output ends with: `Packages successfully migrated.`

If the update requires an intermediate hop (v21 first), run:
```bash
npx @angular/cli update @angular/core@21 @angular/cli@21 --allow-dirty
npx @angular/cli update @angular/core@22 @angular/cli@22 --allow-dirty
```

- [ ] **Step 3: Install @angular/cdk and @angular/aria**

```bash
npm install @angular/cdk@22 @angular/aria@22
```

Expected: installs without peer dependency errors.

- [ ] **Step 4: Verify type definitions exist for @angular/aria**

```bash
cat node_modules/@angular/aria/menu/index.d.ts
cat node_modules/@angular/aria/accordion/index.d.ts
cat node_modules/@angular/aria/autocomplete/index.d.ts
cat node_modules/@angular/aria/combobox/index.d.ts
cat node_modules/@angular/aria/listbox/index.d.ts
```

**Read the output** and note the exact exported class names. This plan uses the names from the design spec (`NgMenuBar`, `NgMenu`, `NgMenuItem`, `NgMenuTrigger`, `NgAccordionGroup`, etc.) — if the actual exports differ, substitute throughout Tasks 2, 4, 6, 7.

- [ ] **Step 5: Verify build still passes**

```bash
ng build --configuration development 2>&1 | tail -20
```

Expected: `Build at:` line with no errors.

- [ ] **Step 6: Commit upgrade**

```bash
git add package.json package-lock.json
git commit -m "chore: upgrade to Angular 22, add @angular/aria and @angular/cdk"
```

---

## Task 1: Branch `00-scaffold`

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Modify: `src/styles.css`
- Modify: `src/app/app.ts`
- Modify: `src/app/app.html`
- Modify: `src/app/app.routes.ts`
- Create: `src/app/shell/app-shell.ts`
- Create: `src/app/shell/app-shell.html`
- Create: `src/app/shell/app-shell.css`
- Create: `src/app/features/session-submission/session-submission.ts`
- Create: `src/app/features/session-submission/session-submission.html`
- Create: `src/app/features/session-submission/session-submission.css`
- Create: `src/app/features/speaker-faq/speaker-faq.ts`
- Create: `src/app/features/speaker-faq/speaker-faq.html`
- Create: `src/app/features/speaker-faq/speaker-faq.css`
- Create: `NARRATION.md`

**Interfaces:**
- Produces: `AppShellComponent` (selector `app-shell`), `SessionSubmissionComponent` (selector `app-session-submission`), `SpeakerFaqComponent` (selector `app-speaker-faq`)

- [ ] **Step 1: Create branch**

```bash
git checkout -b 00-scaffold
```

- [ ] **Step 2: Create token system**

Create `src/styles/tokens.css`:
```css
:root {
  --color-surface: #1a1a2e;
  --color-surface-elevated: #16213e;
  --color-surface-active: #0f3460;
  --color-border: #2a2a4a;
  --color-text: #e0e0f0;
  --color-text-muted: #8888aa;
  --color-accent: #e94560;
  --color-focus-ring: #4fc3f7;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;

  --radius-sm: 4px;
  --radius-md: 8px;

  --duration-fast: 150ms;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Create `src/styles/global.css`:
```css
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

body {
  background: var(--color-surface);
  color: var(--color-text);
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

button {
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}
```

Update `src/styles.css` (replace entire file):
```css
@import './styles/tokens.css';
@import './styles/global.css';
```

- [ ] **Step 3: Create AppShellComponent (plain HTML menubar)**

Create `src/app/shell/app-shell.ts`:
```ts
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShellComponent {
  fileMenuOpen = false;
  helpMenuOpen = false;

  toggleFileMenu(): void {
    this.fileMenuOpen = !this.fileMenuOpen;
    this.helpMenuOpen = false;
  }

  toggleHelpMenu(): void {
    this.helpMenuOpen = !this.helpMenuOpen;
    this.fileMenuOpen = false;
  }

  closeMenus(): void {
    this.fileMenuOpen = false;
    this.helpMenuOpen = false;
  }
}
```

Create `src/app/shell/app-shell.html`:
```html
<nav class="menubar" aria-label="Application menu">
  <div class="menu-group">
    <button
      class="menu-trigger"
      aria-haspopup="true"
      [attr.aria-expanded]="fileMenuOpen"
      (click)="toggleFileMenu()"
    >
      File
    </button>
    @if (fileMenuOpen) {
      <ul class="menu" role="menu">
        <li role="none">
          <a role="menuitem" routerLink="/submit" (click)="closeMenus()">New Submission</a>
        </li>
        <li role="none">
          <button role="menuitem" (click)="closeMenus()">Save Draft</button>
        </li>
        <li role="separator" class="menu-separator"></li>
        <li role="none">
          <button role="menuitem" (click)="closeMenus()">Exit</button>
        </li>
      </ul>
    }
  </div>

  <div class="menu-group">
    <button
      class="menu-trigger"
      aria-haspopup="true"
      [attr.aria-expanded]="helpMenuOpen"
      (click)="toggleHelpMenu()"
    >
      Help
    </button>
    @if (helpMenuOpen) {
      <ul class="menu" role="menu">
        <li role="none">
          <button role="menuitem" (click)="closeMenus()">Keyboard Shortcuts</button>
        </li>
        <li role="none">
          <button role="menuitem" (click)="closeMenus()">About &#64;angular/aria</button>
        </li>
      </ul>
    }
  </div>
</nav>

<main class="main-content">
  <router-outlet />
</main>
```

Create `src/app/shell/app-shell.css`:
```css
.menubar {
  display: flex;
  gap: var(--space-1);
  background: var(--color-surface-elevated);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-1) var(--space-3);
}

.menu-group {
  position: relative;
}

.menu-trigger {
  background: transparent;
  border: none;
  color: var(--color-text);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast) var(--easing-standard);
}

.menu-trigger:hover,
.menu-trigger[aria-expanded='true'] {
  background: var(--color-surface-active);
}

.menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  list-style: none;
  margin: var(--space-1) 0 0;
  padding: var(--space-1);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  min-width: 180px;
}

.menu li[role='none'] button,
.menu li[role='none'] a {
  display: block;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text);
  text-align: left;
  text-decoration: none;
  transition: background var(--duration-fast) var(--easing-standard);
}

.menu li[role='none'] button:hover,
.menu li[role='none'] a:hover {
  background: var(--color-surface-active);
}

.menu-separator {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-1) 0;
}

.main-content {
  padding: var(--space-4);
}
```

- [ ] **Step 4: Create SpeakerFaqComponent (static placeholder)**

Create `src/app/features/speaker-faq/speaker-faq.ts`:
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-speaker-faq',
  templateUrl: './speaker-faq.html',
  styleUrl: './speaker-faq.css',
})
export class SpeakerFaqComponent {}
```

Create `src/app/features/speaker-faq/speaker-faq.html`:
```html
<section class="faq">
  <h2 class="faq-heading">Speaker FAQ</h2>

  <div class="faq-item">
    <button class="faq-trigger">What format should my abstract be in?</button>
    <div class="faq-panel">
      <p>Submit a 150–300 word abstract in plain text. Include a one-sentence summary, 3–4 bullet points covering key takeaways, and your target audience level (beginner / intermediate / advanced).</p>
    </div>
  </div>

  <div class="faq-item">
    <button class="faq-trigger">How long is the demo slot?</button>
    <div class="faq-panel">
      <p>Demo slots are 25 minutes including Q&amp;A. Plan for 18–20 minutes of content with 5–7 minutes for questions. Live coding demos should have a fallback recording in case of network issues.</p>
    </div>
  </div>
</section>
```

Create `src/app/features/speaker-faq/speaker-faq.css`:
```css
.faq {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.faq-heading {
  margin: 0 0 var(--space-3);
  font-size: 1.125rem;
  color: var(--color-text);
}

.faq-item {
  border-top: 1px solid var(--color-border);
}

.faq-trigger {
  display: block;
  width: 100%;
  padding: var(--space-3) 0;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: left;
}

.faq-panel {
  padding-bottom: var(--space-3);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
```

- [ ] **Step 5: Create SessionSubmissionComponent (layout shell)**

Create `src/app/features/session-submission/session-submission.ts`:
```ts
import { Component } from '@angular/core';
import { SpeakerFaqComponent } from '../speaker-faq/speaker-faq';

@Component({
  selector: 'app-session-submission',
  imports: [SpeakerFaqComponent],
  templateUrl: './session-submission.html',
  styleUrl: './session-submission.css',
})
export class SessionSubmissionComponent {}
```

Create `src/app/features/session-submission/session-submission.html`:
```html
<div class="submission-layout">
  <section class="form-section">
    <h1 class="page-title">Submit a Session</h1>
    <p class="form-placeholder">Form coming soon…</p>
  </section>

  <aside class="faq-section">
    <app-speaker-faq />
  </aside>
</div>
```

Create `src/app/features/session-submission/session-submission.css`:
```css
.submission-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--space-5);
  max-width: 1100px;
}

.page-title {
  margin: 0 0 var(--space-4);
  font-size: 1.5rem;
  color: var(--color-text);
}

.form-placeholder {
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .submission-layout {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Wire up routing and root component**

Replace `src/app/app.routes.ts`:
```ts
import { Routes } from '@angular/router';
import { SessionSubmissionComponent } from './features/session-submission/session-submission';

export const routes: Routes = [
  { path: 'submit', component: SessionSubmissionComponent },
  { path: '**', redirectTo: '' },
];
```

Replace `src/app/app.ts`:
```ts
import { Component } from '@angular/core';
import { AppShellComponent } from './shell/app-shell';

@Component({
  selector: 'app-root',
  imports: [AppShellComponent],
  template: '<app-shell />',
})
export class App {}
```

Replace `src/app/app.html` (not needed — template is inline above):
Delete the file if it exists, or leave it — inline template takes precedence.

- [ ] **Step 7: Write NARRATION.md**

Create `NARRATION.md` at repo root:
```markdown
# Branch: 00-scaffold

## What changed
Full file structure is in place: CSS token system, AppShellComponent with a plain HTML menubar,
SessionSubmissionComponent (empty layout), and SpeakerFaqComponent (static text). All tokens and
global styles are finalized — visual output in future branches will match this exactly.

## What to say
"Here's the DevConf Companion app. It looks done — we have a menubar, a two-column layout,
a form section, and a FAQ panel. Let me try navigating it with only a keyboard."

[Tab through the page. Show that the menubar buttons receive focus but arrow keys don't move
between menus, and opening a menu item with Enter/Space doesn't work.]

"The ARIA attributes are there — aria-haspopup, aria-expanded — but they're wired to click
handlers. No keyboard navigation, no focus management, no arrow-key support. The browser
has no idea these buttons form a menubar. That's what @angular/aria fixes."

## Keyboard demo sequence
1. Press Tab — focus lands on "File" button
2. Press Enter — menu opens (via click handler)
3. Press Tab — focus does NOT move into menu items (broken)
4. Press Escape — menu does NOT close (broken)
5. Press Arrow Down — nothing happens (broken)
6. Say: "Three broken behaviors — that's the problem space."
```

- [ ] **Step 8: Verify build**

```bash
ng build --configuration development 2>&1 | tail -20
```

Expected: no errors. If `app.html` conflicts with inline template, delete it:
```bash
rm src/app/app.html
```

- [ ] **Step 9: Commit and tag**

```bash
git add -A
git commit -m "feat: full scaffold — shell, routes, tokens, static components [00-scaffold]"
git tag demo/00-scaffold
```

---

## Task 2: Branch `01-menubar-aria`

**Files:**
- Modify: `src/app/shell/app-shell.ts` — add `@angular/aria/menu` directives
- Modify: `src/app/shell/app-shell.html` — replace manual HTML with directive bindings
- Modify: `src/app/shell/app-shell.css` — style via ARIA state attributes
- Modify: `NARRATION.md`

**Interfaces:**
- Consumes: `AppShellComponent` from Task 1
- Produces: fully keyboard-navigable menubar with arrow keys, Escape, Enter/Space, Home/End

- [ ] **Step 1: Create branch**

```bash
git checkout -b 01-menubar-aria
```

- [ ] **Step 2: Check exact @angular/aria/menu exports**

```bash
cat node_modules/@angular/aria/menu/index.d.ts
```

The directive selector attributes used in templates are: `ngMenuBar`, `ngMenu`, `ngMenuItem`, `ngMenuTrigger`. The import class names should be `NgMenuBar`, `NgMenu`, `NgMenuItem`, `NgMenuTrigger`. Confirm and adjust if different.

- [ ] **Step 3: Rewrite AppShellComponent**

Replace `src/app/shell/app-shell.ts`:
```ts
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgMenuBar, NgMenu, NgMenuItem, NgMenuTrigger } from '@angular/aria/menu';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, NgMenuBar, NgMenu, NgMenuItem, NgMenuTrigger, OverlayModule],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShellComponent {
  navigateToSubmit(router: import('@angular/router').Router): void {
    router.navigate(['/submit']);
  }
}
```

If `@angular/aria/menu` uses named exports differently (e.g., a single `MenuModule`), update the import to: `import { MenuModule } from '@angular/aria/menu';` and add `MenuModule` to `imports`.

- [ ] **Step 4: Rewrite template with aria directives**

Replace `src/app/shell/app-shell.html`:
```html
<nav ngMenuBar aria-label="Application menu" class="menubar">
  <div class="menu-group">
    <button ngMenuTrigger [ngMenuTriggerFor]="fileMenu" class="menu-trigger">
      File
    </button>
  </div>

  <div class="menu-group">
    <button ngMenuTrigger [ngMenuTriggerFor]="helpMenu" class="menu-trigger">
      Help
    </button>
  </div>
</nav>

<ng-template #fileMenu>
  <ul ngMenu class="menu">
    <li role="none">
      <a ngMenuItem routerLink="/submit" class="menu-item-link">New Submission</a>
    </li>
    <li role="none">
      <button ngMenuItem class="menu-item-btn">Save Draft</button>
    </li>
    <li class="menu-separator" role="separator"></li>
    <li role="none">
      <button ngMenuItem class="menu-item-btn">Exit</button>
    </li>
  </ul>
</ng-template>

<ng-template #helpMenu>
  <ul ngMenu class="menu">
    <li role="none">
      <button ngMenuItem class="menu-item-btn">Keyboard Shortcuts</button>
    </li>
    <li role="none">
      <button ngMenuItem class="menu-item-btn">About &#64;angular/aria</button>
    </li>
  </ul>
</ng-template>

<main class="main-content">
  <router-outlet />
</main>
```

- [ ] **Step 5: Update CSS to use ARIA state attributes**

Replace `src/app/shell/app-shell.css`:
```css
.menubar {
  display: flex;
  gap: var(--space-1);
  background: var(--color-surface-elevated);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-1) var(--space-3);
}

.menu-group {
  position: relative;
}

.menu-trigger {
  background: transparent;
  border: none;
  color: var(--color-text);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast) var(--easing-standard);
}

.menu-trigger:hover {
  background: var(--color-surface-active);
}

/* Style via ARIA state — no custom class needed */
[ngMenuTrigger][aria-expanded='true'] {
  background: var(--color-surface-active);
}

.menu {
  list-style: none;
  margin: var(--space-1) 0 0;
  padding: var(--space-1);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  min-width: 180px;
}

.menu-item-btn,
.menu-item-link {
  display: block;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text);
  text-align: left;
  text-decoration: none;
  font-size: inherit;
  font-family: inherit;
  transition: background var(--duration-fast) var(--easing-standard);
}

.menu-item-btn:hover,
.menu-item-link:hover,
[ngMenuItem]:hover .menu-item-btn,
[ngMenuItem]:hover .menu-item-link {
  background: var(--color-surface-active);
}

[ngMenuItem][aria-current='true'] .menu-item-btn,
[ngMenuItem][aria-current='true'] .menu-item-link {
  background: var(--color-surface-active);
  color: var(--color-accent);
}

.menu-separator {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-1) 0;
}

.main-content {
  padding: var(--space-4);
}
```

- [ ] **Step 6: Verify build**

```bash
ng build --configuration development 2>&1 | tail -20
npm start &
```

Open browser to `http://localhost:4200`. Tab to "File", press Arrow Down — should move to "Help". Press Enter — menu opens. Arrow Down moves through items. Escape closes.

Kill dev server: `kill %1`

- [ ] **Step 7: Update NARRATION.md**

Replace `NARRATION.md`:
```markdown
# Branch: 01-menubar-aria

## What changed
`@angular/aria/menu` directives (`ngMenuBar`, `ngMenuTrigger`, `ngMenu`, `ngMenuItem`) replace
the manual click-handler menubar. CDK Overlay handles popup positioning. Styles now target
`[ngMenuTrigger][aria-expanded='true']` instead of a custom `.is-open` class.

## What to say
"Four lines of directive imports, three attribute changes in the template. Same HTML structure.
Let me show you what changed."

`git diff 00-scaffold 01-menubar-aria -- src/app/shell/`

"The diff is the story — we removed the `fileMenuOpen`/`helpMenuOpen` booleans, the toggle
methods, the `@if` blocks. We added `ngMenuBar`, `ngMenuTrigger`, `ngMenu`, `ngMenuItem`.
That's it. @angular/aria took care of focus management, keyboard navigation, and ARIA
attribute wiring."

## Keyboard demo sequence
1. Press Tab — focus lands on "File"
2. Press Arrow Right — focus moves to "Help" (menubar roving tabindex)
3. Press Arrow Left — back to "File"
4. Press Enter or Space — File menu opens, focus moves to first item
5. Press Arrow Down / Up — moves through menu items
6. Press Home / End — jumps to first / last item
7. Press Escape — menu closes, focus returns to "File" trigger
8. Open DevTools → Elements → inspect "File" button
   — Show `role="menuitem"`, `aria-expanded="true"`, `aria-haspopup="menu"` toggling live
```

- [ ] **Step 8: Commit and tag**

```bash
git add -A
git commit -m "feat: @angular/aria/menu + CDK overlay — keyboard-navigable menubar [01-menubar-aria]"
git tag demo/01-menubar-aria
```

---

## Task 3: Branch `02-accordion-faq`

**Files:**
- Modify: `src/app/features/speaker-faq/speaker-faq.ts` — add click toggle
- Modify: `src/app/features/speaker-faq/speaker-faq.html` — manual open/close
- Modify: `src/app/features/speaker-faq/speaker-faq.css` — open state via class
- Modify: `NARRATION.md`

**Purpose:** Show the broken pattern (same problem as branch 00 menubar) before fixing it with @angular/aria.

**Interfaces:**
- Consumes: `SpeakerFaqComponent` from Task 1
- Produces: click-only accordion with no keyboard support, no ARIA attributes

- [ ] **Step 1: Create branch**

```bash
git checkout -b 02-accordion-faq
```

- [ ] **Step 2: Rewrite SpeakerFaqComponent with manual toggle**

Replace `src/app/features/speaker-faq/speaker-faq.ts`:
```ts
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
```

Replace `src/app/features/speaker-faq/speaker-faq.html`:
```html
<section class="faq">
  <h2 class="faq-heading">Speaker FAQ</h2>

  <div class="faq-item">
    <button class="faq-trigger" [class.is-open]="panel1Open()" (click)="toggle(1)">
      What format should my abstract be in?
    </button>
    @if (panel1Open()) {
      <div class="faq-panel">
        <p>Submit a 150–300 word abstract in plain text. Include a one-sentence summary,
        3–4 bullet points covering key takeaways, and your target audience level
        (beginner / intermediate / advanced).</p>
      </div>
    }
  </div>

  <div class="faq-item">
    <button class="faq-trigger" [class.is-open]="panel2Open()" (click)="toggle(2)">
      How long is the demo slot?
    </button>
    @if (panel2Open()) {
      <div class="faq-panel">
        <p>Demo slots are 25 minutes including Q&amp;A. Plan for 18–20 minutes of content
        with 5–7 minutes for questions. Live coding demos should have a fallback recording
        in case of network issues.</p>
      </div>
    }
  </div>
</section>
```

Replace `src/app/features/speaker-faq/speaker-faq.css`:
```css
.faq {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.faq-heading {
  margin: 0 0 var(--space-3);
  font-size: 1.125rem;
  color: var(--color-text);
}

.faq-item {
  border-top: 1px solid var(--color-border);
}

.faq-trigger {
  display: block;
  width: 100%;
  padding: var(--space-3) 0;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: left;
  transition: color var(--duration-fast) var(--easing-standard);
}

.faq-trigger.is-open {
  color: var(--color-accent);
}

.faq-panel {
  padding-bottom: var(--space-3);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
```

- [ ] **Step 3: Verify build**

```bash
ng build --configuration development 2>&1 | tail -20
```

- [ ] **Step 4: Update NARRATION.md**

Replace `NARRATION.md`:
```markdown
# Branch: 02-accordion-faq

## What changed
SpeakerFaqComponent now has click-toggle open/close state. But it's the same broken pattern
as the branch-00 menubar: click works, keyboard doesn't. No `aria-expanded`, no
`aria-controls`, no `role="region"`. The active state is toggled via `.is-open` class,
not ARIA attributes.

## What to say
"Accordion, same story as the menubar. Click works. Let me Tab to a question and press
Space or Enter."

[Demonstrate: Tab to trigger button, press Space — panel opens. Now press Tab again —
focus moves INTO the panel text, then out the bottom. Arrow keys do nothing. Screen reader
users hear a generic button with no expanded state.]

"The button has no aria-expanded. The panel has no role. A screen reader announces
'What format should my abstract be in? button' with no context about whether content
is shown. Same fix — @angular/aria/accordion."

## Keyboard demo sequence
1. Tab to first FAQ button, press Space — panel opens (click handler fires on Space)
2. Tab — focus skips INTO panel content (wrong: should stay on triggers)
3. Press Escape — nothing (no close behavior)
4. Inspect button in DevTools — no aria-expanded attribute
5. Say: "One more widget, same missing ARIA, same missing keyboard contract"
```

- [ ] **Step 5: Commit and tag**

```bash
git add -A
git commit -m "feat: click-only accordion — shows broken pattern before @angular/aria [02-accordion-faq]"
git tag demo/02-accordion-faq
```

---

## Task 4: Branch `03-accordion-aria`

**Files:**
- Modify: `src/app/features/speaker-faq/speaker-faq.ts` — replace manual state with @angular/aria/accordion
- Modify: `src/app/features/speaker-faq/speaker-faq.html` — directive bindings
- Modify: `src/app/features/speaker-faq/speaker-faq.css` — ARIA state selectors
- Modify: `NARRATION.md`

**Interfaces:**
- Consumes: `SpeakerFaqComponent` from Task 3
- Produces: `SpeakerFaqComponent` with full ARIA accordion — keyboard navigation, `aria-expanded` wired, single-expand enforced

- [ ] **Step 1: Create branch**

```bash
git checkout -b 03-accordion-aria
```

- [ ] **Step 2: Check @angular/aria/accordion exports**

```bash
cat node_modules/@angular/aria/accordion/index.d.ts
```

Expected exports: `NgAccordionGroup`, `NgAccordionItem`, `NgAccordionTrigger`, `NgAccordionPanel`, `NgAccordionContent`. Adjust import names if different.

- [ ] **Step 3: Rewrite SpeakerFaqComponent**

Replace `src/app/features/speaker-faq/speaker-faq.ts`:
```ts
import { Component } from '@angular/core';
import {
  NgAccordionGroup,
  NgAccordionItem,
  NgAccordionTrigger,
  NgAccordionPanel,
  NgAccordionContent,
} from '@angular/aria/accordion';

@Component({
  selector: 'app-speaker-faq',
  imports: [NgAccordionGroup, NgAccordionItem, NgAccordionTrigger, NgAccordionPanel, NgAccordionContent],
  templateUrl: './speaker-faq.html',
  styleUrl: './speaker-faq.css',
})
export class SpeakerFaqComponent {}
```

If `@angular/aria/accordion` exports a single `AccordionModule`, use:
```ts
import { AccordionModule } from '@angular/aria/accordion';
// and add AccordionModule to imports array
```

Replace `src/app/features/speaker-faq/speaker-faq.html`:
```html
<section class="faq">
  <h2 class="faq-heading">Speaker FAQ</h2>

  <div ngAccordionGroup [multiExpandable]="false" class="faq-group">
    <div ngAccordionItem class="faq-item">
      <button ngAccordionTrigger class="faq-trigger">
        What format should my abstract be in?
      </button>
      <div ngAccordionPanel class="faq-panel">
        <div ngAccordionContent>
          <p>Submit a 150–300 word abstract in plain text. Include a one-sentence summary,
          3–4 bullet points covering key takeaways, and your target audience level
          (beginner / intermediate / advanced).</p>
        </div>
      </div>
    </div>

    <div ngAccordionItem class="faq-item">
      <button ngAccordionTrigger class="faq-trigger">
        How long is the demo slot?
      </button>
      <div ngAccordionPanel class="faq-panel">
        <div ngAccordionContent>
          <p>Demo slots are 25 minutes including Q&amp;A. Plan for 18–20 minutes of content
          with 5–7 minutes for questions. Live coding demos should have a fallback recording
          in case of network issues.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

Replace `src/app/features/speaker-faq/speaker-faq.css`:
```css
.faq {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.faq-heading {
  margin: 0 0 var(--space-3);
  font-size: 1.125rem;
  color: var(--color-text);
}

.faq-group {
  display: flex;
  flex-direction: column;
}

.faq-item {
  border-top: 1px solid var(--color-border);
}

.faq-trigger {
  display: block;
  width: 100%;
  padding: var(--space-3) 0;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: left;
  transition: color var(--duration-fast) var(--easing-standard);
}

/* Style via ARIA state — no .is-open class */
[ngAccordionTrigger][aria-expanded='true'] {
  color: var(--color-accent);
}

[ngAccordionTrigger]:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.faq-panel {
  overflow: hidden;
  transition: height var(--duration-fast) var(--easing-standard);
}

[ngAccordionContent] p {
  padding-bottom: var(--space-3);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin: 0;
}
```

- [ ] **Step 4: Verify build**

```bash
ng build --configuration development 2>&1 | tail -20
```

- [ ] **Step 5: Update NARRATION.md**

Replace `NARRATION.md`:
```markdown
# Branch: 03-accordion-aria

## What changed
SpeakerFaqComponent now uses `@angular/aria/accordion` directives: `ngAccordionGroup`,
`ngAccordionItem`, `ngAccordionTrigger`, `ngAccordionPanel`, `ngAccordionContent`.
`[multiExpandable]="false"` enforces single-panel-open. CSS uses `[ngAccordionTrigger][aria-expanded='true']`
instead of `.is-open`.

## What to say
`git diff 02-accordion-faq 03-accordion-aria -- src/app/features/speaker-faq/`

"The diff: removed `signal()`, removed `toggle()`, removed `[class.is-open]`. Added five
directive imports and attribute selectors. Zero JavaScript state management — @angular/aria
owns that. The CSS still targets the same `aria-expanded` attribute, so it reads like the
spec: 'when expanded, color is accent.'"

"Open DevTools → Elements. Click a FAQ trigger. Watch `aria-expanded` flip from false to
true in real time. The panel gets `role='region'` and `aria-labelledby` pointing back
to the trigger. That's the WAI-ARIA Accordion pattern — complete, correct, zero lines
of accessibility code written by us."

## Keyboard demo sequence
1. Tab to first FAQ trigger
2. Press Space or Enter — panel opens, aria-expanded="true" visible in DevTools
3. Press Tab — focus stays on accordion triggers (does NOT fall into panel)
4. Press Arrow Down — moves to second trigger (roving tabindex or sequential)
5. Press Space — second panel opens, first closes (multiExpandable=false)
6. Press Home — jumps to first trigger
7. Press End — jumps to last trigger
8. Inspect the open panel in DevTools — show role="region" and aria-labelledby
```

- [ ] **Step 6: Commit and tag**

```bash
git add -A
git commit -m "feat: @angular/aria/accordion — ARIA-correct keyboard accordion [03-accordion-aria]"
git tag demo/03-accordion-aria
```

---

## Task 5: Branch `04-signal-form-shell`

**Files:**
- Modify: `src/app/features/session-submission/session-submission.ts` — Signal Form with plain inputs
- Modify: `src/app/features/session-submission/session-submission.html` — form with three fields
- Modify: `src/app/features/session-submission/session-submission.css` — form layout
- Modify: `NARRATION.md`

**Interfaces:**
- Consumes: `SessionSubmissionComponent` layout from Task 1
- Produces: working Signal Form — `speakerName`, `talkTrack`, `coSpeaker` as plain `<input>` elements; submit logs to console

- [ ] **Step 1: Create branch**

```bash
git checkout -b 04-signal-form-shell
```

- [ ] **Step 2: Rewrite SessionSubmissionComponent with Signal Form**

Replace `src/app/features/session-submission/session-submission.ts`:
```ts
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
```

Replace `src/app/features/session-submission/session-submission.html`:
```html
<div class="submission-layout">
  <section class="form-section">
    <h1 class="page-title">Submit a Session</h1>

    @if (submitted()) {
      <div class="success-banner" role="status">
        ✅ Session submitted! Check the console for the form value.
      </div>
    }

    <form class="session-form" (submit)="onSubmit($event)" novalidate>
      <div class="field-group">
        <label class="field-label" for="speakerName">Speaker Name</label>
        <input
          id="speakerName"
          type="text"
          class="field-input"
          [formField]="sessionForm.speakerName"
          autocomplete="name"
        />
        @if (sessionForm.speakerName().touched() && sessionForm.speakerName().invalid()) {
          <ul class="field-errors" role="alert">
            @for (error of sessionForm.speakerName().errors(); track error.kind) {
              <li>{{ error.message }}</li>
            }
          </ul>
        }
      </div>

      <div class="field-group">
        <label class="field-label" for="talkTrack">Talk Track</label>
        <input
          id="talkTrack"
          type="text"
          class="field-input"
          [formField]="sessionForm.talkTrack"
          placeholder="e.g. Frontend, DevOps, AI/ML…"
        />
        @if (sessionForm.talkTrack().touched() && sessionForm.talkTrack().invalid()) {
          <ul class="field-errors" role="alert">
            @for (error of sessionForm.talkTrack().errors(); track error.kind) {
              <li>{{ error.message }}</li>
            }
          </ul>
        }
      </div>

      <div class="field-group">
        <label class="field-label" for="coSpeaker">Session Format</label>
        <input
          id="coSpeaker"
          type="text"
          class="field-input"
          [formField]="sessionForm.coSpeaker"
          placeholder="e.g. Workshop, Panel, Live Coding…"
        />
      </div>

      <button type="submit" class="submit-btn" [disabled]="sessionForm().invalid()">
        Submit Session
      </button>
    </form>
  </section>

  <aside class="faq-section">
    <app-speaker-faq />
  </aside>
</div>
```

Replace `src/app/features/session-submission/session-submission.css`:
```css
.submission-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--space-5);
  max-width: 1100px;
}

.page-title {
  margin: 0 0 var(--space-4);
  font-size: 1.5rem;
  color: var(--color-text);
}

.success-banner {
  padding: var(--space-3);
  background: var(--color-surface-active);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  color: var(--color-text);
  margin-bottom: var(--space-4);
}

.session-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.field-input {
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 0.9375rem;
  font-family: inherit;
  transition: border-color var(--duration-fast) var(--easing-standard);
}

.field-input:focus {
  outline: none;
  border-color: var(--color-focus-ring);
}

.field-errors {
  margin: 0;
  padding-left: var(--space-3);
  list-style: disc;
  color: var(--color-accent);
  font-size: 0.8125rem;
}

.submit-btn {
  align-self: flex-start;
  padding: var(--space-2) var(--space-4);
  background: var(--color-accent);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-weight: 600;
  transition: opacity var(--duration-fast) var(--easing-standard);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .submission-layout {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Verify build and form works**

```bash
ng build --configuration development 2>&1 | tail -20
```

Start dev server, navigate to `/submit`, fill in fields, submit — check console logs the model value.

- [ ] **Step 4: Update NARRATION.md**

Replace `NARRATION.md`:
```markdown
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
```

- [ ] **Step 5: Commit and tag**

```bash
git add -A
git commit -m "feat: Signal Form scaffold — three fields, required validation, submit [04-signal-form-shell]"
git tag demo/04-signal-form-shell
```

---

## Task 6: Branch `05-autocomplete`

**Files:**
- Modify: `src/app/features/session-submission/session-submission.ts` — add NgAutocomplete
- Modify: `src/app/features/session-submission/session-submission.html` — talkTrack → autocomplete
- Modify: `src/app/features/session-submission/session-submission.css` — autocomplete panel styles
- Modify: `NARRATION.md`

**Interfaces:**
- Consumes: `SessionSubmissionComponent` with Signal Form from Task 5
- Produces: `talkTrack` field as autocomplete — shows filtered track list, `aria-activedescendant` updates on arrow keys

- [ ] **Step 1: Create branch**

```bash
git checkout -b 05-autocomplete
```

- [ ] **Step 2: Check @angular/aria/autocomplete exports**

```bash
cat node_modules/@angular/aria/autocomplete/index.d.ts
```

Expected: `NgAutocomplete`, `NgAutocompletePanel`, `NgAutocompleteOption`. Adjust if different.

- [ ] **Step 3: Update SessionSubmissionComponent**

Replace `src/app/features/session-submission/session-submission.ts`:
```ts
import { Component, computed, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { NgAutocomplete, NgAutocompletePanel, NgAutocompleteOption } from '@angular/aria/autocomplete';
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
    NgAutocomplete,
    NgAutocompletePanel,
    NgAutocompleteOption,
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

  readonly filteredTracks = computed(() => {
    const query = this.model().talkTrack.toLowerCase();
    if (!query) return ALL_TRACKS;
    return ALL_TRACKS.filter((t) => t.toLowerCase().includes(query));
  });

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
```

Replace `src/app/features/session-submission/session-submission.html` (talkTrack field only — full file):
```html
<div class="submission-layout">
  <section class="form-section">
    <h1 class="page-title">Submit a Session</h1>

    @if (submitted()) {
      <div class="success-banner" role="status">
        ✅ Session submitted! Check the console for the form value.
      </div>
    }

    <form class="session-form" (submit)="onSubmit($event)" novalidate>
      <div class="field-group">
        <label class="field-label" for="speakerName">Speaker Name</label>
        <input
          id="speakerName"
          type="text"
          class="field-input"
          [formField]="sessionForm.speakerName"
          autocomplete="name"
        />
        @if (sessionForm.speakerName().touched() && sessionForm.speakerName().invalid()) {
          <ul class="field-errors" role="alert">
            @for (error of sessionForm.speakerName().errors(); track error.kind) {
              <li>{{ error.message }}</li>
            }
          </ul>
        }
      </div>

      <div class="field-group">
        <label class="field-label" for="talkTrack">Talk Track</label>
        <div class="autocomplete-wrapper">
          <input
            id="talkTrack"
            type="text"
            class="field-input"
            [formField]="sessionForm.talkTrack"
            [ngAutocomplete]="trackPanel"
          />
          <ng-template #trackPanel>
            <ul ngAutocompletePanel class="autocomplete-panel">
              @for (track of filteredTracks(); track track) {
                <li ngAutocompleteOption [value]="track" class="autocomplete-option">
                  {{ track }}
                </li>
              }
              @empty {
                <li class="autocomplete-empty">No matching tracks</li>
              }
            </ul>
          </ng-template>
        </div>
        @if (sessionForm.talkTrack().touched() && sessionForm.talkTrack().invalid()) {
          <ul class="field-errors" role="alert">
            @for (error of sessionForm.talkTrack().errors(); track error.kind) {
              <li>{{ error.message }}</li>
            }
          </ul>
        }
      </div>

      <div class="field-group">
        <label class="field-label" for="coSpeaker">Session Format</label>
        <input
          id="coSpeaker"
          type="text"
          class="field-input"
          [formField]="sessionForm.coSpeaker"
          placeholder="e.g. Workshop, Panel, Live Coding…"
        />
      </div>

      <button type="submit" class="submit-btn" [disabled]="sessionForm().invalid()">
        Submit Session
      </button>
    </form>
  </section>

  <aside class="faq-section">
    <app-speaker-faq />
  </aside>
</div>
```

Add to `src/app/features/session-submission/session-submission.css` (append — don't replace existing):
```css
.autocomplete-wrapper {
  position: relative;
}

.autocomplete-panel {
  list-style: none;
  margin: var(--space-1) 0 0;
  padding: var(--space-1);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  max-height: 200px;
  overflow-y: auto;
}

.autocomplete-option {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  cursor: default;
  transition: background var(--duration-fast) var(--easing-standard);
}

/* Active option via ARIA attribute */
[ngAutocompleteOption][aria-selected='true'] {
  background: var(--color-surface-active);
  color: var(--color-accent);
}

.autocomplete-empty {
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
```

- [ ] **Step 4: Verify build**

```bash
ng build --configuration development 2>&1 | tail -20
```

Test: Tab to Talk Track, type "fr" — panel shows "Frontend". Arrow Down highlights it. Enter selects it — field value updates, panel closes.

- [ ] **Step 5: Update NARRATION.md**

Replace `NARRATION.md`:
```markdown
# Branch: 05-autocomplete

## What changed
The Talk Track field is now an `ngAutocomplete`. The input has `[ngAutocomplete]="trackPanel"`
pointing to an `<ng-template>` containing an `ngAutocompletePanel` with `ngAutocompleteOption`
items. Filtered options are driven by a `computed()` signal. CSS targets `[ngAutocompleteOption][aria-selected='true']`.

## What to say
"Talk Track is now an autocomplete. Same Signal Form field — `[formField]='sessionForm.talkTrack'`
— we just added `[ngAutocomplete]='trackPanel'`. The directive handles `aria-autocomplete`,
`aria-expanded`, `aria-activedescendant`, `role='combobox'` on the input, and `role='listbox'`
on the panel. Watch aria-activedescendant in DevTools as I arrow down."

## Keyboard demo sequence
1. Tab to Talk Track input
2. Type "fr" — panel opens, "Frontend" appears
3. Press Arrow Down — panel item gets [aria-selected='true']
4. In DevTools → show aria-activedescendant on input updating to the option's id
5. Press Enter — "Frontend" selected, panel closes, field value updated
6. Clear field — type nothing — all 9 tracks shown
7. Press Escape — panel closes without selecting
```

- [ ] **Step 6: Commit and tag**

```bash
git add -A
git commit -m "feat: talkTrack → ngAutocomplete with filtered track list [05-autocomplete]"
git tag demo/05-autocomplete
```

---

## Task 7: Branch `06-combobox`

**Files:**
- Modify: `src/app/features/session-submission/session-submission.ts` — add NgCombobox + NgListbox
- Modify: `src/app/features/session-submission/session-submission.html` — coSpeaker → combobox
- Modify: `src/app/features/session-submission/session-submission.css` — listbox styles
- Modify: `NARRATION.md`

**Interfaces:**
- Consumes: `SessionSubmissionComponent` with autocomplete from Task 6
- Produces: `coSpeaker` field as combobox + listbox — select-only list with 8 format options

- [ ] **Step 1: Create branch**

```bash
git checkout -b 06-combobox
```

- [ ] **Step 2: Check @angular/aria/combobox and /listbox exports**

```bash
cat node_modules/@angular/aria/combobox/index.d.ts
cat node_modules/@angular/aria/listbox/index.d.ts
```

Expected combobox: `NgCombobox`, `NgComboboxInput`. Expected listbox: `NgListbox`, `NgOption`. Adjust if different.

- [ ] **Step 3: Update SessionSubmissionComponent**

Replace `src/app/features/session-submission/session-submission.ts`:
```ts
import { Component, computed, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { NgAutocomplete, NgAutocompletePanel, NgAutocompleteOption } from '@angular/aria/autocomplete';
import { NgCombobox, NgComboboxInput } from '@angular/aria/combobox';
import { NgListbox, NgOption } from '@angular/aria/listbox';
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

const SESSION_FORMATS = [
  'Lightning Talk', 'Workshop', 'Panel', 'Live Coding',
  'Fireside Chat', 'Keynote', 'Birds of a Feather', 'Office Hours',
];

@Component({
  selector: 'app-session-submission',
  imports: [
    SpeakerFaqComponent,
    FormField,
    NgAutocomplete,
    NgAutocompletePanel,
    NgAutocompleteOption,
    NgCombobox,
    NgComboboxInput,
    NgListbox,
    NgOption,
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
  readonly formats = SESSION_FORMATS;

  readonly filteredTracks = computed(() => {
    const query = this.model().talkTrack.toLowerCase();
    if (!query) return ALL_TRACKS;
    return ALL_TRACKS.filter((t) => t.toLowerCase().includes(query));
  });

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
```

Replace `src/app/features/session-submission/session-submission.html` (coSpeaker field updated — full file):
```html
<div class="submission-layout">
  <section class="form-section">
    <h1 class="page-title">Submit a Session</h1>

    @if (submitted()) {
      <div class="success-banner" role="status">
        ✅ Session submitted! Check the console for the form value.
      </div>
    }

    <form class="session-form" (submit)="onSubmit($event)" novalidate>
      <div class="field-group">
        <label class="field-label" for="speakerName">Speaker Name</label>
        <input
          id="speakerName"
          type="text"
          class="field-input"
          [formField]="sessionForm.speakerName"
          autocomplete="name"
        />
        @if (sessionForm.speakerName().touched() && sessionForm.speakerName().invalid()) {
          <ul class="field-errors" role="alert">
            @for (error of sessionForm.speakerName().errors(); track error.kind) {
              <li>{{ error.message }}</li>
            }
          </ul>
        }
      </div>

      <div class="field-group">
        <label class="field-label" for="talkTrack">Talk Track</label>
        <div class="autocomplete-wrapper">
          <input
            id="talkTrack"
            type="text"
            class="field-input"
            [formField]="sessionForm.talkTrack"
            [ngAutocomplete]="trackPanel"
          />
          <ng-template #trackPanel>
            <ul ngAutocompletePanel class="autocomplete-panel">
              @for (track of filteredTracks(); track track) {
                <li ngAutocompleteOption [value]="track" class="autocomplete-option">
                  {{ track }}
                </li>
              }
              @empty {
                <li class="autocomplete-empty">No matching tracks</li>
              }
            </ul>
          </ng-template>
        </div>
        @if (sessionForm.talkTrack().touched() && sessionForm.talkTrack().invalid()) {
          <ul class="field-errors" role="alert">
            @for (error of sessionForm.talkTrack().errors(); track error.kind) {
              <li>{{ error.message }}</li>
            }
          </ul>
        }
      </div>

      <div class="field-group">
        <label class="field-label" for="coSpeakerInput">Session Format</label>
        <div ngCombobox [formField]="sessionForm.coSpeaker" class="combobox-wrapper">
          <input
            id="coSpeakerInput"
            ngComboboxInput
            class="field-input"
            placeholder="Select a format…"
            readonly
          />
          <ul ngListbox class="listbox-panel">
            @for (format of formats; track format) {
              <li ngOption [value]="format" class="listbox-option">
                {{ format }}
              </li>
            }
          </ul>
        </div>
      </div>

      <button type="submit" class="submit-btn" [disabled]="sessionForm().invalid()">
        Submit Session
      </button>
    </form>
  </section>

  <aside class="faq-section">
    <app-speaker-faq />
  </aside>
</div>
```

Append to `src/app/features/session-submission/session-submission.css`:
```css
.combobox-wrapper {
  position: relative;
}

.listbox-panel {
  list-style: none;
  margin: var(--space-1) 0 0;
  padding: var(--space-1);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  max-height: 220px;
  overflow-y: auto;
}

.listbox-option {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  cursor: default;
  transition: background var(--duration-fast) var(--easing-standard);
}

[ngOption][aria-selected='true'] {
  background: var(--color-surface-active);
  color: var(--color-accent);
}
```

- [ ] **Step 4: Verify build**

```bash
ng build --configuration development 2>&1 | tail -20
```

Test: Tab to Session Format, press Enter/Space — listbox opens. Arrow Down moves through options. Enter selects.

- [ ] **Step 5: Update NARRATION.md**

Replace `NARRATION.md`:
```markdown
# Branch: 06-combobox

## What changed
Session Format is now a combobox + listbox: `ngCombobox` wraps the field, `ngComboboxInput`
on the input, `ngListbox` on the `<ul>`, `ngOption` on each `<li>`. Unlike autocomplete,
this is a closed select — no freeform input, just the 8 format options. Both fields use
the same Signal Form `[formField]` binding.

## What to say
"Autocomplete vs combobox — same @angular/aria family, different interaction contract.
Autocomplete lets you type and filter. Combobox gives you a structured list — no freeform
entry. The wiring is similar but the primitives are different. That's the 'choose your
primitive' moment this library is designed for."

[Show git diff 05-autocomplete 06-combobox]

"The diff adds six imports and one block of HTML. The ARIA semantics are completely different:
`role='combobox'` on the input, `role='listbox'` on the panel, `role='option'` on each item,
`aria-selected` toggling as you arrow through. All managed by @angular/aria."

## Keyboard demo sequence
1. Tab to Session Format (combobox input)
2. Press Enter or Space — listbox opens, role="listbox" visible in DevTools
3. Arrow Down — `[ngOption][aria-selected='true']` moves down the list
4. Press Enter — option selected, listbox closes, input shows selected value
5. Compare with Talk Track field — "same [formField] binding, different aria primitive"
6. DevTools: compare aria-autocomplete="list" (Talk Track) vs role="combobox" (Session Format)
```

- [ ] **Step 6: Commit and tag**

```bash
git add -A
git commit -m "feat: coSpeaker → ngCombobox + ngListbox — select-only format picker [06-combobox]"
git tag demo/06-combobox
```

---

## Task 8: Branch `07-material-comparison`

**Files:**
- Create: `src/app/features/speaker-faq-material/speaker-faq-material.ts`
- Create: `src/app/features/speaker-faq-material/speaker-faq-material.html`
- Modify: `src/app/features/session-submission/session-submission.ts` — import SpeakerFaqMaterialComponent
- Modify: `src/app/features/session-submission/session-submission.html` — add both accordions side by side
- Modify: `src/app/features/session-submission/session-submission.css` — comparison layout
- Create: `BUNDLE_SIZES.md`
- Modify: `NARRATION.md`

**Interfaces:**
- Consumes: everything from Task 7
- Produces: two accordions side by side (`@angular/aria` vs `@angular/material/expansion`); `BUNDLE_SIZES.md` with production build sizes

- [ ] **Step 1: Create branch**

```bash
git checkout -b 07-material-comparison
```

- [ ] **Step 2: Install @angular/material**

```bash
npm install @angular/material@22
```

Do NOT run `ng add @angular/material` — that injects themes into `angular.json`. We want manual control. Expected: installs without peer dependency errors.

- [ ] **Step 3: Create SpeakerFaqMaterialComponent**

Create `src/app/features/speaker-faq-material/speaker-faq-material.ts`:
```ts
import { Component } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';

@Component({
  selector: 'app-speaker-faq-material',
  imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle],
  templateUrl: './speaker-faq-material.html',
})
export class SpeakerFaqMaterialComponent {}
```

Create `src/app/features/speaker-faq-material/speaker-faq-material.html`:
```html
<mat-accordion [multi]="false">
  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>What format should my abstract be in?</mat-panel-title>
    </mat-expansion-panel-header>
    <p>Submit a 150–300 word abstract in plain text. Include a one-sentence summary,
    3–4 bullet points covering key takeaways, and your target audience level
    (beginner / intermediate / advanced).</p>
  </mat-expansion-panel>

  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>How long is the demo slot?</mat-panel-title>
    </mat-expansion-panel-header>
    <p>Demo slots are 25 minutes including Q&amp;A. Plan for 18–20 minutes of content
    with 5–7 minutes for questions. Live coding demos should have a fallback recording
    in case of network issues.</p>
  </mat-expansion-panel>
</mat-accordion>
```

- [ ] **Step 4: Add Material theme to styles**

`@angular/material/expansion` requires a theme. Append to `src/styles.css`:
```css
@import '@angular/material/prebuilt-themes/indigo-pink.css';
```

- [ ] **Step 5: Update SessionSubmissionComponent to show both accordions**

Update `src/app/features/session-submission/session-submission.ts` — add import:
```ts
import { SpeakerFaqMaterialComponent } from '../speaker-faq-material/speaker-faq-material';
```

Add `SpeakerFaqMaterialComponent` to the `imports` array.

Update `src/app/features/session-submission/session-submission.html` — replace aside:
```html
  <aside class="faq-section">
    <h2 class="comparison-heading">FAQ: @angular/aria vs @angular/material</h2>
    <div class="faq-comparison">
      <div class="faq-col">
        <h3 class="faq-col-label">@angular/aria</h3>
        <app-speaker-faq />
      </div>
      <div class="faq-col">
        <h3 class="faq-col-label">@angular/material</h3>
        <app-speaker-faq-material />
      </div>
    </div>
  </aside>
```

Append to `src/app/features/session-submission/session-submission.css`:
```css
.comparison-heading {
  margin: 0 0 var(--space-3);
  font-size: 1rem;
  color: var(--color-text-muted);
}

.faq-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.faq-col-label {
  margin: 0 0 var(--space-2);
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
}
```

- [ ] **Step 6: Run production builds and record sizes**

```bash
# Build without material (use 03-accordion-aria as baseline)
git stash
git checkout 03-accordion-aria
ng build --configuration production 2>&1 | grep "Initial total"
# Record the number

git checkout 07-material-comparison
git stash pop
ng build --configuration production 2>&1 | grep "Initial total"
# Record the number
```

Note: `git stash / pop` may not work cleanly across branches. Alternative:
```bash
# From branch 03-accordion-aria (already tagged):
git checkout 03-accordion-aria
ng build --configuration production 2>&1 | grep -E "Initial|kB|KB"

# Return to 07:
git checkout 07-material-comparison
ng build --configuration production 2>&1 | grep -E "Initial|kB|KB"
```

- [ ] **Step 7: Create BUNDLE_SIZES.md**

Create `BUNDLE_SIZES.md` at repo root with actual numbers from Step 6:
```markdown
# Bundle Size Comparison

Production build (`ng build --configuration production`), measured on 2026-06-30.

| Branch | Initial JS (kB) | Initial CSS (kB) | Notes |
|--------|----------------|-----------------|-------|
| `03-accordion-aria` | _fill in_ | _fill in_ | @angular/aria accordion only |
| `07-material-comparison` | _fill in_ | _fill in_ | + @angular/material/expansion + CDK |

**Delta:** +_fill in_ kB JS, +_fill in_ kB CSS from adding @angular/material.

## How to re-measure

```bash
ng build --configuration production 2>&1 | grep -E "Initial|kB|KB"
```

Re-run before the talk if any dependency versions change.
```

Fill in the actual numbers from Step 6 before committing.

- [ ] **Step 8: Update NARRATION.md**

Replace `NARRATION.md`:
```markdown
# Branch: 07-material-comparison

## What changed
`SpeakerFaqMaterialComponent` added using `MatAccordion`/`MatExpansionPanel`. It renders
beside the `@angular/aria` accordion. `@angular/material@22` added to dependencies.
`BUNDLE_SIZES.md` created with production build sizes from both branches.

## What to say
"Two accordions, same content, same questions. Left: @angular/aria — your HTML, your CSS,
zero Material imports. Right: @angular/material — opinionated visual style, theme CSS,
full Material runtime."

[Point to BUNDLE_SIZES.md — read numbers aloud]

"@angular/aria accordion costs roughly zero extra kB beyond what CDK already gives you.
@angular/material adds [X] kB for the expansion module plus the theme. Not a moral judgment —
sometimes you want Material's design system. But if you only need the ARIA pattern, @angular/aria
gets you there without the payload."

## Keyboard demo sequence
1. Tab through both accordions — same keyboard contract (Space/Enter, Arrow keys)
2. Visual contrast: Material has its own visual style, @angular/aria uses our tokens
3. Inspect the @angular/aria accordion — no mat- classes, no Material theme styles
4. Inspect the Material accordion — mat-expansion-panel, Material CSS variables
5. Speak BUNDLE_SIZES.md numbers aloud
```

- [ ] **Step 9: Commit and tag**

```bash
git add -A
git commit -m "feat: Material accordion comparison + BUNDLE_SIZES.md [07-material-comparison]"
git tag demo/07-material-comparison
```

---

## Task 9: Branch `08-final-polish`

**Files:**
- Modify: `src/styles/global.css` — motion-preference-aware transitions
- Modify: `src/app/shell/app-shell.css` — consistent focus ring on all interactive elements
- Modify: `src/app/features/session-submission/session-submission.css` — focus ring on submit button
- Modify: `NARRATION.md`

**Interfaces:**
- Consumes: everything from Task 8
- Produces: consistent focus rings, `prefers-reduced-motion` respected

- [ ] **Step 1: Create branch**

```bash
git checkout -b 08-final-polish
```

- [ ] **Step 2: Add reduced-motion media query to global.css**

Append to `src/styles/global.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Ensure focus-visible is consistent across all components**

Verify `src/styles/global.css` has the base `:focus-visible` rule (already added in Task 1 Step 2). Confirm it renders correctly on all interactive elements: menu triggers, menu items, accordion triggers, form inputs, submit button.

Append to `src/app/features/session-submission/session-submission.css`:
```css
.submit-btn:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

- [ ] **Step 4: Verify build**

```bash
ng build --configuration production 2>&1 | tail -20
```

Expected: builds cleanly.

- [ ] **Step 5: Update NARRATION.md**

Replace `NARRATION.md`:
```markdown
# Branch: 08-final-polish

## What changed
`prefers-reduced-motion` media query added globally — all transitions collapse to 0.01ms
when motion is reduced. Focus ring consistency verified across all interactive elements
using the `--color-focus-ring` token throughout.

## What to say
"Last polish pass. The focus ring uses `--color-focus-ring` everywhere — one token, one
place to change it. And all our CSS transitions respect `prefers-reduced-motion`. If a
user has set that preference in their OS, every animation collapses to instant. One media
query in global.css, zero changes to any component."

"This is @angular/aria's value proposition in one sentence: you control the CSS, you
control accessibility. The library manages state and keyboard behavior. You handle
everything the user sees."

## Keyboard demo sequence
1. Tab through entire app — every interactive element has visible focus ring
2. Open DevTools → Rendering → Enable 'Emulate CSS prefers-reduced-motion'
3. Open/close menu — instant, no transition
4. Open/close FAQ accordion — instant
5. Turn off emulation — transitions return
6. Say: "One media query. All motion respect. That's what owning your CSS means."
```

- [ ] **Step 6: Commit and tag**

```bash
git add -A
git commit -m "feat: reduced-motion support + focus ring consistency [08-final-polish]"
git tag demo/08-final-polish
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Angular 22, standalone, zoneless — Task 0
- ✅ `@angular/aria/menu` — Task 2
- ✅ `@angular/cdk/overlay` — Task 2 (imported alongside menu)
- ✅ `@angular/aria/accordion`, `multiExpandable="false"` — Task 4
- ✅ `@angular/forms/signals` — Task 5
- ✅ `ngAutocomplete` for Talk Track — Task 6
- ✅ `ngCombobox` + `ngListbox`/`ngOption` for Session Format — Task 7
- ✅ `@angular/material/expansion` in branch 07 only — Task 8
- ✅ `BUNDLE_SIZES.md` — Task 8, Step 7
- ✅ CSS custom properties from design spec — Task 1, Step 2
- ✅ ARIA state attribute selectors in CSS (`[aria-expanded='true']`, `[ngAccordionTrigger]`) — Tasks 2, 4, 6, 7
- ✅ `NARRATION.md` updated per branch — every task
- ✅ `git tag demo/<branch-name>` — every task
- ✅ Two routes: `/` and `/submit` — Task 1, Step 6
- ✅ 8 branches total (00–08) — Tasks 1–9
- ✅ No env vars, no network calls — all tasks
- ✅ `provideZonelessChangeDetection` preserved — Task 0 (no removal)

**Placeholder scan:** No TBD/TODO in code steps. BUNDLE_SIZES.md has fill-in slots but those are measured at runtime (live numbers, not placeholders — they're instructions).

**Type consistency:** `sessionForm.speakerName`, `sessionForm.talkTrack`, `sessionForm.coSpeaker` used consistently across Tasks 5–8. `SpeakerFaqComponent` selector `app-speaker-faq` used in Tasks 5–8. `SpeakerFaqMaterialComponent` selector `app-speaker-faq-material` in Task 8 only.

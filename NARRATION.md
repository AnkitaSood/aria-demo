# Branch: 03-accordion-aria

## What changed
SpeakerFaqComponent now uses `@angular/aria/accordion` directives: `ngAccordionGroup`,
`ngAccordionTrigger`, `ngAccordionPanel`, `ngAccordionContent`.
`[multiExpandable]="false"` enforces single-panel-open. CSS uses `[ngAccordionTrigger][aria-expanded='true']`
instead of `.is-open`. Content is lazily rendered via `ng-template[ngAccordionContent]`.

## What to say
`git diff 02-accordion-faq 03-accordion-aria -- src/app/features/speaker-faq/`

"The diff: removed `signal()`, removed `toggle()`, removed `[class.is-open]`. Added four
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

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

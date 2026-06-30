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

Note: `ng build` on branches 07 and 08 shows a 514 kB bundle warning — the 500 kB threshold was designed for branches 00–06. The excess is entirely @angular/material: that warning *is* the point.

## Keyboard demo sequence
1. Tab through entire app — every interactive element has visible focus ring
2. Open DevTools → Rendering → Enable 'Emulate CSS prefers-reduced-motion'
3. Open/close menu — instant, no transition
4. Open/close FAQ accordion — instant
5. Turn off emulation — transitions return
6. Say: "One media query. All motion respect. That's what owning your CSS means."

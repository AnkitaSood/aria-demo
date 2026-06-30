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
@angular/material adds 148 kB JS for the expansion module plus 104 kB for the theme. Not a moral judgment —
sometimes you want Material's design system. But if you only need the ARIA pattern, @angular/aria
gets you there without the payload."

## Keyboard demo sequence
1. Tab through both accordions — same keyboard contract (Space/Enter, Arrow keys)
2. Visual contrast: Material has its own visual style, @angular/aria uses our tokens
3. Inspect the @angular/aria accordion — no mat- classes, no Material theme styles
4. Inspect the Material accordion — mat-expansion-panel, Material CSS variables
5. Speak BUNDLE_SIZES.md numbers aloud

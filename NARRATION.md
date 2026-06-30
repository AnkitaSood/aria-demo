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

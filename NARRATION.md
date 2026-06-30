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

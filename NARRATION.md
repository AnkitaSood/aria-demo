# Branch: 06-combobox

## What changed
Session Format is now a select-only combobox: `[ngCombobox]` on the input (with `readonly`),
`ng-template[ngComboboxPopup]` wrapping the popup, and `[ngComboboxWidget][ngListbox]` on the `<ul>`
with `[ngOption]` on each `<li>`. Unlike Talk Track, no freeform text is allowed — the input is
`readonly` and the user must pick from the 8 format options.

Signal bridge: `selectedFormat = signal<string[]>([])` receives the listbox selection, and an
`effect()` writes `selected[0]` to `model.coSpeaker` and `formatQuery` (the combobox display value).
No `[formField]` on this field — same lesson as Task 6.

## What to say
"Autocomplete vs combobox — same @angular/aria family, different interaction contract.
Autocomplete lets you type and filter. Combobox gives you a structured list — no freeform
entry. The wiring is similar but the primitives are different. That's the 'choose your
primitive' moment this library is designed for."

[Show git diff 05-autocomplete 06-combobox]

"The diff adds SESSION_FORMATS, a `selectedFormat` signal, a `formatQuery` signal, an effect,
and one block of HTML. The ARIA semantics are completely different:
`role='combobox'` on the input, `role='listbox'` on the panel, `role='option'` on each item,
`aria-selected` toggling as you arrow through. All managed by @angular/aria."

## Keyboard demo sequence
1. Tab to Session Format (combobox input — readonly, so no typing)
2. Press Enter or Space — listbox opens, `role="listbox"` visible in DevTools
3. Arrow Down — `[ngOption][aria-selected='true']` moves down the list
4. Press Enter — option selected, listbox closes, input shows selected value
5. Compare with Talk Track field — "editable input, filtered list = autocomplete; readonly input, full list = select-only combobox"
6. DevTools: compare `aria-autocomplete="list"` (Talk Track) vs `role="combobox"` (Session Format — no aria-autocomplete)

# Branch: 05-autocomplete

## What changed
The Talk Track field is now an accessible autocomplete widget composed from `@angular/aria/combobox`
primitives: `Combobox` (`[ngCombobox]`), `ComboboxPopup` (`ng-template[ngComboboxPopup]`), and
`ComboboxWidget` (`[ngComboboxWidget]`), combined with `Listbox` and `Option` from `@angular/aria/listbox`.

Filtering is driven by a `computed()` signal. CSS targets `[ngOption][aria-selected='true']`
to style the active option — no custom class.

Note: `@angular/aria/autocomplete` does not exist in v22. The pattern is composed from
`Combobox + ComboboxPopup + ComboboxWidget + Listbox + Option`.

## What to say
"Talk Track is now an autocomplete. The input has `[ngCombobox]` and `#combobox='ngCombobox'`.
The directive handles `aria-autocomplete`, `aria-expanded`, `aria-activedescendant`, and `role='combobox'`
on the input automatically. The popup is an `ng-template[ngComboboxPopup]` containing a `ul` with
both `[ngComboboxWidget]` and `[ngListbox]` — these two directives make the listbox communicate
active-descendant IDs back up to the combobox input.

Watch `aria-activedescendant` in DevTools as I arrow down through the options — it updates to the
active option's ID on every keystroke. The Signal Form field `[formField]='sessionForm.talkTrack'`
stays on the input, and an `effect()` bridges the listbox selection back into the form model."

## Keyboard demo sequence
1. Tab to Talk Track input — `role="combobox"` is set on the input
2. Type "fr" — panel opens, "Frontend" appears (filtered by `computed()`)
3. Press Arrow Down — "Frontend" gets `[aria-selected='true']`
4. In DevTools → show `aria-activedescendant` on the input updating to the option's ID
5. Press Enter — "Frontend" selected, panel closes, field value updated in the form model
6. Clear field — type nothing — all 9 tracks shown
7. Press Escape — panel closes without selecting

# Waiter check communication page

## Confirmed scope

- Entry: `Show the waiter` on the third, unknown result. A known `Can’t Eat` conflict does not offer this action.
- Unknown-food context: the captured photo is shown without an inferred dish name or result tags.
- Keep the captured photo and translated request in one waiter-facing card.
- Provide a language control at the right side of the page title. It opens a dedicated selection page with Simplified Chinese and Japanese.
- The user-facing English preview can be edited through structured Peanut and Mild-spice controls; every waiter-language version updates from the same state.
- Translate `Peanut` as an allergy and `Mild spice` as a spice-level need; do not add an unprovided severity claim.
- Keep this as a scripted demo; no microphone, live translation, or restaurant response is implied.

## Interaction

- The unknown result keeps the mouth in its chewing state and replaces reason tags with the waiter action.
- Opening the page preserves the unknown result underneath.
- The bottom acknowledgement follows the selected waiter language; navigation back to the result remains in the header.
- The card identifies the dish, asks about direct peanut use and preparation contact, and asks staff to say when they cannot confirm.

## Verification

- 402×874 has no horizontal overflow.
- The English user preview remains unchanged when the waiter language switches between Chinese and Japanese.
- Keyboard focus and reduced-motion behavior reuse existing Ant Design and motion rules.

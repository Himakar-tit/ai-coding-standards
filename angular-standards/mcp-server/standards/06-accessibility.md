# Accessibility (Mandatory WCAG)

## Validate
- Semantic HTML first (`button`, `a`, `nav`, `main`, headings)
- Keyboard accessibility for all interactive controls
- Focus management in dialogs/menus/popovers
- Accessible names: labels, `aria-labelledby`, visible text
- Correct ARIA — no redundant or invalid patterns
- Visible focus indicators; logical tab order
- Form errors associated with fields (`aria-describedby`)
- Dynamic state announcements (`aria-live` where needed)
- Proper heading hierarchy (h1 → h2 → h3, no skips)

## Flag (BLOCKER)
- Clickable `div`/`span` without role, keyboard handler, and focus
- Missing labels on form inputs
- Focus traps or focus loss on modal open/close
- Inaccessible custom controls without ARIA + keyboard contract
- `aria-hidden` on focusable elements

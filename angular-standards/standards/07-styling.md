# Styling & Design System

## Validate
- Design token usage (spacing, color, typography)
- Style encapsulation; component-scoped styles
- Responsive behavior via design system breakpoints
- No arbitrary z-index stacking
- No hardcoded colors/spacing outside tokens

## Flag
- Deep selector abuse (`::ng-deep` without migration plan)
- Specificity wars / global overrides
- Hardcoded visual constants
- Style leakage across feature boundaries

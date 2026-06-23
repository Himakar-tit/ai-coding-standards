# PR Review Output Format

Use EXACTLY this structure:

```
# Final Verdict
- APPROVED | APPROVED WITH REQUIRED CHANGES | REJECTED — REFACTOR REQUIRED

# Blockers
# High Severity Issues
# Medium Severity Issues
# Low Severity Improvements
# Angular Anti-Patterns
# RxJS / Reactive Concerns
# Performance Risks
# Accessibility Violations
# Maintainability Concerns
# Architecture & Scalability Concerns
# Positive Engineering Decisions
# Required Refactors Before Merge
```

## Severity
- **BLOCKER**: Must fix before merge
- **HIGH**: Significant architectural/performance/accessibility concern
- **MEDIUM**: Maintainability or scalability concern
- **LOW**: Improvement opportunity

## Review Behavior
- Direct and technical; no generic praise
- Focus architecture, scalability, rendering, reactivity, maintainability, accessibility
- Reject mediocre patterns even if they work
- Prioritize long-term scalability over short-term convenience

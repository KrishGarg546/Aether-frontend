<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Aether Frontend Agent Guidelines

## Project Context

Aether is a goal-driven marketing intelligence platform. The frontend is designed around a single principle:

> Autonomous decisions should be transparent.

The UI should help users understand **why** Aether made a decision, not just display the outcome.

---

## Product Philosophy

When making changes to this codebase, preserve these principles:

1. **Goal-driven over feature-driven**
   - Users specify business outcomes, not technical workflows.
   - Avoid introducing unnecessary configuration complexity.

2. **Explainability over black-box automation**
   - Campaign decisions should be traceable.
   - Always surface reasoning, recommendations, and historical context where appropriate.

3. **Deterministic experiences over magical behavior**
   - Mission execution stages should be explicit.
   - System state changes should be understandable.

4. **Elegance through restraint**
   - Prefer clean layouts with strong hierarchy.
   - Avoid excessive animations or decorative UI elements.
   - The existing visual language is intentional.

---

## Technical Expectations

- This project uses Next.js App Router.
- Prefer Server Components unless client-side interactivity is required.
- Reuse existing hooks and components before creating new abstractions.
- Keep components focused and composable.
- Follow existing naming conventions.
- Maintain strict TypeScript safety.

---

## Working With Backend Data

Backend responses represent real campaign history and may contain incomplete values.

Always assume API fields can be:

- `null`
- `undefined`
- empty arrays
- partially populated

Requirements:

- Never call `.toFixed()` without validating the value.
- Never call `.toLowerCase()` on unchecked strings.
- Guard `.map()` operations with sensible defaults.
- Prefer graceful fallbacks (`"—"`, `[]`, `"Unknown"`) instead of runtime failures.

Reliability is more important than visual perfection.

---

## Archive Page Rules

The Mission Archive represents operational truth.

- Preserve mission chronology.
- Do not fabricate metrics when data is unavailable.
- Show duration only when valid data exists.
- Missing data should degrade gracefully.
- Archive views must remain stable when browsing historical campaigns.

---

## Before Finalizing Changes

Verify that:

- TypeScript errors are resolved.
- The application builds successfully.
- Real backend data does not produce runtime crashes.
- Archive missions can be expanded safely.
- Existing visual hierarchy remains consistent across pages.

Optimize for maintainability, clarity, and trust.
@AGENTS.md

# Claude Instructions — Aether Frontend

@AGENTS.md

## Project Overview

Aether is a goal-driven marketing intelligence platform.

The frontend should present a coherent journey:

Mission Control
→ Mission Archive
→ Intelligence
→ Learnings

Every page should reinforce the idea that Aether transforms business intent into explainable action.

---

## Frontend Architecture

### Mission Control

Purpose:
- Define business goals.
- Configure audience strategy.
- Launch campaigns.
- Surface execution progress.

Do not redesign this flow into a generic form experience.

---

### Mission Archive

Purpose:
- Preserve historical campaign executions.
- Display operational truth.
- Surface recommendations derived from outcomes.

Rules:
- Never fabricate metrics.
- Handle missing data gracefully.
- Historical missions must remain explorable.
- Duration should only appear when valid.

---

### Intelligence

Purpose:
- Explain how Aether understands customers.
- Surface reasoning behind interventions.
- Show evolution over time.

Rules:
- Prioritize clarity over density.
- Preserve existing visual hierarchy.
- Explanations are as important as outcomes.

---

### Learnings

Purpose:
- Represent accumulated organizational intelligence.
- Surface patterns across missions.
- Demonstrate how the platform evolves.

Rules:
- Avoid duplicating Archive functionality.
- Focus on synthesis rather than raw history.

---

## Technical Standards

- Use TypeScript safely.
- Prefer extending existing components before introducing new abstractions.
- Maintain consistency with existing Tailwind patterns.
- Reuse hooks whenever possible.
- Preserve accessibility.

---

## Working With Backend Data

Assume backend responses may contain:

- null values
- undefined values
- empty arrays
- partially populated records

Requirements:

- Guard `.toFixed()` usage.
- Guard `.toLowerCase()` usage.
- Provide sensible fallbacks.
- Prevent runtime crashes.

Frontend resilience is mandatory.

---

## Definition of Done

Before considering work complete, verify:

- The application builds successfully.
- TypeScript passes.
- No runtime errors occur while browsing Archive missions.
- Visual consistency is maintained across pages.
- Existing product philosophy remains intact.

Optimize for trust, clarity, maintainability, and product quality.
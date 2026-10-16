# ADR 0001: Prerequisites are AND-only and there are no co-requisites

- Status: Accepted
- Date: 2026-10-16

## Context

The planner decides whether a course is available and whether a term plan is valid. Both depend on how prerequisites are modeled. Two modeling questions came up before the first migration:

1. Can a prerequisite be an alternative ("A OR B")?
2. Are there co-requisites, i.e. courses that may be taken in the same term as the one that requires them?

Checked against real CIn-UFPE curriculum data:

- A course can have several prerequisites and all of them are required (e.g. Machine Learning requires Linear Algebra AND Introduction to Programming).
- No course uses "OR" prerequisites.
- No course has co-requisites.

## Decision

- `course_prerequisites` is a plain edge table `(course_id, required_course_id)` with `CHECK (course_id <> required_course_id)`. There is no `kind` column and no grouping of alternatives.
- A course is available when it is not completed and every prerequisite is `CURSADA`.
- A prerequisite must be completed before the term. Taking it in the same term never satisfies it.
- The prerequisite graph must be a DAG. The seed fails on cycles and on references to unknown courses.

## Consequences

- Positive: the domain stays small. `getAvailableCourses` and `validateTerm` are pure functions over a set of completed course ids, with no look at the rest of the term. Topological ordering for stage 2 is direct, because the edge table already is the dependency graph.
- Positive: no extra column or enum to maintain in the schema, seed and DTOs.
- Negative: if the curriculum ever adds OR prerequisites or co-requisites, the model must change (a `kind` column or a group/alternative table) and the domain functions with it. A migration plus new tests would be needed.
- Mitigation: if real data contradicts these rules, we stop and revisit this ADR instead of working around the model.

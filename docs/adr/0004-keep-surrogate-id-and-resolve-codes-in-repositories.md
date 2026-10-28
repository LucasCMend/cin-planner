# ADR 0004: Courses keep a surrogate `id` next to the `code`, and repositories resolve codes

- Status: Accepted
- Date: 2026-10-27

## Context

A course has two identifiers in `schema.prisma`: `id` (autoincrement integer, primary key) and `code` (the official UFPE code, for example `CIN0133`, unique). The relation tables (`user_courses`, `course_prerequisites`, `major_courses`) reference `id`.

The rest of the system speaks `code`. The API receives codes, the domain functions (`courseStatus`, `validateTerm`) compare codes, and users know courses by code. Every time a service crossed from one world to the other, it asked the database for the course again.

`ValidateTermService` and `CourseStatusService` did exactly that: one query per prerequisite and one query per course in the user's history, only to turn ids into codes. The number of queries grew with the size of the history.

Options considered:

1. Keep both identifiers. Add repository methods that read the relation and return codes in the same query.
2. Make `code` the primary key and reference it from the relation tables. No translation is needed, but it needs a migration, changes to every repository and DTO, and text keys in every relation table.
3. Load an `id -> code` map of the whole catalog in the service and translate in memory. One query, but the service keeps a copy of the catalog.

## Decision

Option 1. `id` stays as the internal key and `code` stays as the identifier used by the API and the domain.

- Only repositories know that both exist. They use Prisma relations (`select` on the related course) and return plain values with the code already resolved, never Prisma types.
- `CoursePrerequisiteRepository.getRequiredCodesByCourse(courseId)` returns the codes of the prerequisites of a course.
- `UserCourseRepository.getCodesByUser(userId)` returns `{ code, status }` for each course in a user's history.
- Services and domain never translate ids. If a use case needs codes from a new relation, the repository gets a method for it.
- The existing methods (`getByCourse`, `getByUser`) stay, because the CRUDs use them.

## Consequences

- Positive: the number of queries no longer depends on the size of the history. `CourseStatusService` makes 4 queries per call. `ValidateTermService` makes 1 for the user, 2 per course in the term, and 1 for the history.
- Positive: no migration, no data change, and the domain stays pure and keeps working with codes.
- Positive: the layer rule holds. Only the repository touches Prisma, and nothing from Prisma leaks upward.
- Negative: the model keeps two identifiers for the same thing, and a reader has to learn which one is used where. This ADR is that explanation.
- Negative: each new read that needs codes asks for a new repository method, instead of reusing a generic one.
- Negative: `ValidateTermService` still makes 2 queries per course in the term. The term is small, so this is accepted for now. A method that reads many courses at once would remove it.
- Note: earlier text in `CLAUDE.md` says courses are keyed by the official code. That is not what the schema does, and it should be corrected to match this ADR.

# CLAUDE.md

# CIn Planner

Academic planner for CIn-UFPE students: mark completed courses, visualize prerequisites as an interactive graph, build valid term plans with explained blocks. Also a portfolio project for internship interviews: code quality, domain tests and documented decisions matter as much as features.

## Stack
Client: Next.js, TypeScript, React Flow, dagre. Server: Node, Express, Prisma, PostgreSQL, Zod, Vitest. Auth: Google OAuth.

## Scope
MVP: auth, course history, prerequisite graph with per-node status, term validation. Stage 2: plans until graduation, save/share.
Out of scope (do not implement): AI chat/RAG, "what if" simulator, schedule conflicts, offerings per semester, multiple curriculum versions, equivalences.

## Architecture
Root folder is `cin-planner/`. `client/` and `server/` (no Turborepo, no extra packages). Server layers in `server/src/`:
- routes: URL -> controller, middlewares
- controllers: HTTP only; validate with DTO, call service
- services: orchestrate repository + domain
- repositories: only place that touches Prisma; never leak Prisma types upward
- domain: pure functions, no Prisma/Express/Zod
- dto: Zod schemas
Dependencies: controller -> service -> repository and domain. Domain depends on nothing.
Source of truth for data: `server/prisma/schema.prisma`. Course catalog: lives only in the database, no data files in the repo (ADR 0003). ADRs in `docs/adr/`.

## Data model decisions
- `courses` holds only universal data; `major_courses` holds per-major data (type, recommended term).
- Courses are keyed by their official UFPE code (e.g. CIN0133, MA026). The catalog was imported once into PostgreSQL, which is its only source of truth (ADR 0003, supersedes ADR 0002).
- `course_prerequisites` is an edge table (course_id, required_course_id), with CHECK course_id <> required_course_id. No `kind` column: CIn has no co-requisites, every edge is a prerequisite.

## Business rules
- Prerequisites are AND only (no OR), confirmed against real CIn data. A course may have several prerequisites and ALL are required (e.g. Machine Learning requires Linear Algebra AND Intro to Programming). If real data later contradicts this, ask before changing the model.
- A course is available if not yet completed and all its prerequisites are CURSADA.
- Node status: cursada, cursando, disponível, bloqueada.
- No co-requisites: a prerequisite must be CURSADA before the term; taking it in the same term never satisfies it. Do not model or implement CO. The PPC 2024 has one elective co-requisite (Segurança de Redes e Sistemas Distribuídos requires Sistemas Distribuídos); it is intentionally not modeled (ADR 0001 amendment). If more appear, ask first.
- Term validation: check prerequisites and workload limit; every block returns the explicit missing prerequisites.
- Prerequisite graph must be a DAG. The database blocks self-references, dangling references and duplicates, but not cycles: `validatePrerequisiteGraph` must run on graph data read from the database and before any prerequisite write (ADR 0003).
- Only courses from the user's major enter the graph and planning.

## Conventions
- Strict TypeScript, no `any`.
- Every domain function has Vitest unit tests, no DB mocks.
- Validate all API input with Zod.
- Conventional commits (feat:, fix:, test:, docs:, chore:).
- Record relevant architecture decisions as short ADRs.

## Working style
- Small steps; explain reasoning briefly. I own the project and must defend each decision in interviews.
- If something is ambiguous or conflicts with this file, ask first.
- No new dependencies or complexity outside the MVP without justification.

## Tutor mode
- Claude must NOT write code in this project: no edits to source files, no ready-to-paste implementations.
- Act as a teacher: explain concepts, point to which file/layer to change, ask guiding questions, review my code and point out bugs.
- Hints and pseudocode in prose are fine; the final implementation is always written by me.

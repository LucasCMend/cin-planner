# ADR 0002: The curriculum catalog lives in versioned JSON and is loaded by a seed

- Status: Superseded by [ADR 0003](0003-curriculum-catalog-only-in-database.md)
- Date: 2026-10-16

## Context

The course catalog (courses, prerequisites, which courses belong to a major) is the same for every student and changes a few times a year. A wrong prerequisite blocks students without any error, so the data needs review like code does. At runtime the API reads everything from PostgreSQL; the question is where the catalog is maintained.

Options considered:

1. JSON files in the repository, validated and loaded into the database by a seed script.
2. SQL `INSERT`s in a migration or `.sql` file.
3. Edit the database directly (no file as source), possibly behind an admin panel.
4. Import from an external source (Sigaa, the PPC PDF) with a scraper or parser.

## Decision

Option 1.

- `data/courses.json`: universal course data and prerequisites, referenced by official course code.
- `data/majors/<major>.json`: the major and its courses (`OBRIGATORIA` or `ELETIVA`, recommended term).
- The seed validates before writing anything: file shape (Zod), duplicate codes, repeated or self-referencing prerequisites, prerequisites that point to unknown courses, cycles (the graph must be a DAG), and consistency between the two files. It reports every problem at once.
- Validation is pure code (`validatePrerequisiteGraph` in the domain, the rest in `server/prisma/seed/`) and is unit tested without a database. A test also loads the real files in `data/`, so a bad edit fails in CI.
- The seed writes in a single transaction and is idempotent.

## Consequences

- Positive: catalog changes are reviewed in pull requests with a diff and history. Invalid data cannot reach the database. Anyone can rebuild the environment with `docker compose up`, `migrate` and `seed`.
- Positive: the schema and the API do not know about the JSON; a different source later only changes the seed.
- Negative: updating the curriculum means editing a file and running the seed. There is no admin UI, which is out of scope.
- Negative: the PPC PDF is transcribed by hand, so typos are possible. The validations catch structural mistakes (wrong code, cycle) but not a wrong workload number.
- Option 3 only makes sense if non-developers need to edit the curriculum. Option 4 is fragile and left as a possible future improvement.

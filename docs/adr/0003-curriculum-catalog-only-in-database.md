# ADR 0003: The curriculum catalog lives only in the database

- Status: Accepted
- Date: 2026-10-22
- Supersedes: [ADR 0002](0002-curriculum-catalog-in-versioned-json.md)

## Context

ADR 0002 kept the catalog (courses, prerequisites, major courses) in `data/*.json`, to be loaded by a seed. The seed loader and its validations were written, but the step that writes to the database was not. The JSON files were the only copy of the data, and the database was empty.

The catalog is application data, not code. Keeping it in files in the repository and in the database means two copies that can drift apart.

## Decision

PostgreSQL is the only source of truth for the catalog. There are no data files in the repository.

- On 2026-10-22, the CC catalog (PPC 2024: 22 obligatory courses, 17 prerequisite edges) was imported once from `data/` into the local database, in a single transaction. The counts were checked after the import.
- `data/` was removed. The last version of the files is in git history (commit `5d9e724`).

## Consequences

- Positive: one copy of the data, read by the API from the same place it is stored.
- Negative: a new database (another machine, CI, production) starts with an empty catalog. Data must be copied from an existing database (`pg_dump` of the catalog tables) or recovered from git history.
- Negative: catalog changes are no longer reviewed as pull request diffs and have no history in the repository.
- Negative: the validation from ADR 0002 no longer runs before data is written. The database still prevents self-references (CHECK), dangling references (foreign keys) and duplicate codes (unique). Nothing in the database prevents a prerequisite cycle, so `validatePrerequisiteGraph` must run on the data read from the database before it is trusted.
- The file loader in `server/prisma/seed/` no longer has any input files. It must be removed or adapted.

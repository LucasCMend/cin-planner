/** A course and the codes of the courses it requires. All prerequisites are required (AND, ADR 0001). */
export interface CourseNode {
  readonly code: string;
  readonly prerequisites: readonly string[];
}

export type GraphIssue =
  | { readonly type: 'DUPLICATE_COURSE'; readonly code: string }
  | { readonly type: 'SELF_PREREQUISITE'; readonly code: string }
  | { readonly type: 'DUPLICATE_PREREQUISITE'; readonly code: string; readonly required: string }
  | { readonly type: 'UNKNOWN_PREREQUISITE'; readonly code: string; readonly required: string }
  | { readonly type: 'CYCLE'; readonly path: readonly string[] };

/**
 * Finds prerequisite cycles with a depth-first search.
 *
 * A path `[A, B, C]` means A requires B, B requires C and C requires A. A self-requirement is the
 * cycle `[A]`. Reports at least one cycle per cyclic component, not every possible cycle.
 * Prerequisites that point to unknown courses are ignored here; `validatePrerequisiteGraph`
 * reports them.
 */
export function detectCycles(courses: readonly CourseNode[]): string[][] {
  const prerequisitesByCode = new Map<string, readonly string[]>();
  for (const course of courses) {
    prerequisitesByCode.set(course.code, course.prerequisites);
  }

  const state = new Map<string, 'visiting' | 'done'>();
  const stack: string[] = [];
  const cycles: string[][] = [];

  const visit = (code: string): void => {
    state.set(code, 'visiting');
    stack.push(code);

    for (const required of prerequisitesByCode.get(code) ?? []) {
      if (!prerequisitesByCode.has(required)) continue;

      const requiredState = state.get(required);
      if (requiredState === 'visiting') {
        cycles.push(stack.slice(stack.indexOf(required)));
      } else if (requiredState === undefined) {
        visit(required);
      }
    }

    stack.pop();
    state.set(code, 'done');
  };

  for (const code of prerequisitesByCode.keys()) {
    if (!state.has(code)) visit(code);
  }

  return cycles;
}

/**
 * Checks that the prerequisite graph can be loaded: unique course codes, no repeated or
 * self-referencing edges, no edges to unknown courses and no cycles (it must be a DAG).
 * Returns every issue found; an empty list means the graph is valid.
 */
export function validatePrerequisiteGraph(courses: readonly CourseNode[]): GraphIssue[] {
  const issues: GraphIssue[] = [];

  const codes = new Set<string>();
  for (const { code } of courses) {
    if (codes.has(code)) issues.push({ type: 'DUPLICATE_COURSE', code });
    codes.add(code);
  }

  for (const { code, prerequisites } of courses) {
    const seen = new Set<string>();
    for (const required of prerequisites) {
      if (required === code) {
        issues.push({ type: 'SELF_PREREQUISITE', code });
        continue;
      }
      if (seen.has(required)) {
        issues.push({ type: 'DUPLICATE_PREREQUISITE', code, required });
        continue;
      }
      seen.add(required);
      if (!codes.has(required)) issues.push({ type: 'UNKNOWN_PREREQUISITE', code, required });
    }
  }

  for (const path of detectCycles(courses)) {
    // A self-requirement is already reported as SELF_PREREQUISITE.
    if (path.length > 1) issues.push({ type: 'CYCLE', path });
  }

  return issues;
}

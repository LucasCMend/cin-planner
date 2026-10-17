import { describe, expect, it } from 'vitest';
import { detectCycles, validatePrerequisiteGraph, type CourseNode } from './prerequisite-graph.js';

const course = (code: string, ...prerequisites: string[]): CourseNode => ({ code, prerequisites });

describe('detectCycles', () => {
  it('returns no cycles for an empty graph', () => {
    expect(detectCycles([])).toEqual([]);
  });

  it('returns no cycles for a DAG with a diamond', () => {
    const diamond = [course('A'), course('B', 'A'), course('C', 'A'), course('D', 'B', 'C')];

    expect(detectCycles(diamond)).toEqual([]);
  });

  it('detects a course that requires itself', () => {
    expect(detectCycles([course('A', 'A')])).toEqual([['A']]);
  });

  it('detects a cycle between two courses once', () => {
    expect(detectCycles([course('A', 'B'), course('B', 'A')])).toEqual([['A', 'B']]);
  });

  it('reports only the cycle, not the courses that lead into it', () => {
    const courses = [course('X', 'A'), course('A', 'B'), course('B', 'C'), course('C', 'A')];

    expect(detectCycles(courses)).toEqual([['A', 'B', 'C']]);
  });

  it('detects cycles in separate components', () => {
    const courses = [course('A', 'B'), course('B', 'A'), course('C', 'D'), course('D', 'C')];

    expect(detectCycles(courses)).toEqual([
      ['A', 'B'],
      ['C', 'D'],
    ]);
  });

  it('ignores prerequisites that point to unknown courses', () => {
    expect(detectCycles([course('A', 'GHOST')])).toEqual([]);
  });
});

describe('validatePrerequisiteGraph', () => {
  it('accepts a valid graph', () => {
    const courses = [course('A'), course('B', 'A'), course('C', 'A', 'B')];

    expect(validatePrerequisiteGraph(courses)).toEqual([]);
  });

  it('reports duplicate course codes', () => {
    expect(validatePrerequisiteGraph([course('A'), course('A')])).toEqual([
      { type: 'DUPLICATE_COURSE', code: 'A' },
    ]);
  });

  it('reports a self prerequisite once, without also reporting a cycle', () => {
    expect(validatePrerequisiteGraph([course('A', 'A')])).toEqual([
      { type: 'SELF_PREREQUISITE', code: 'A' },
    ]);
  });

  it('reports a repeated prerequisite', () => {
    expect(validatePrerequisiteGraph([course('A'), course('B', 'A', 'A')])).toEqual([
      { type: 'DUPLICATE_PREREQUISITE', code: 'B', required: 'A' },
    ]);
  });

  it('reports a prerequisite that does not exist', () => {
    expect(validatePrerequisiteGraph([course('A', 'B')])).toEqual([
      { type: 'UNKNOWN_PREREQUISITE', code: 'A', required: 'B' },
    ]);
  });

  it('reports a cycle with its path', () => {
    const courses = [course('A', 'C'), course('B', 'A'), course('C', 'B')];

    expect(validatePrerequisiteGraph(courses)).toEqual([{ type: 'CYCLE', path: ['A', 'C', 'B'] }]);
  });

  it('reports every issue at once', () => {
    const courses = [course('A', 'B'), course('B', 'A'), course('C', 'GHOST')];

    expect(validatePrerequisiteGraph(courses)).toEqual([
      { type: 'UNKNOWN_PREREQUISITE', code: 'C', required: 'GHOST' },
      { type: 'CYCLE', path: ['A', 'B'] },
    ]);
  });
});

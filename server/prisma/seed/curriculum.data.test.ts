import { describe, expect, it } from 'vitest';
import { loadCurriculum } from './curriculum.js';

// Guards the real files in data/ so a bad edit fails in CI before it reaches the seed.
describe('CC curriculum data (data/)', () => {
  it('loads and passes every validation', () => {
    expect(() => loadCurriculum()).not.toThrow();
  });

  it('gives every obligatory course a recommended term', () => {
    const { majorCourses } = loadCurriculum();

    const obligatory = majorCourses.filter((entry) => entry.type === 'OBRIGATORIA');

    expect(obligatory.length).toBeGreaterThan(0);
    expect(obligatory.every((entry) => entry.recommendedTerm !== null)).toBe(true);
  });

  it('requires all prerequisites of a course, not just one (AND semantics)', () => {
    const { courses } = loadCurriculum();

    const compilers = courses.find((course) => course.code === 'CIN0150');

    expect([...(compilers?.prerequisites ?? [])].sort()).toEqual(['CIN0140', 'CIN0148']);
  });
});

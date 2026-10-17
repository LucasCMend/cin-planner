import { describe, expect, it } from 'vitest';
import { CurriculumValidationError, parseCurriculum } from './curriculum.js';

const validCourses = [
  { code: 'CIN0001', name: 'Intro', workloadHours: 60, credits: 4, prerequisites: [] },
  {
    code: 'CIN0002',
    name: 'Advanced',
    workloadHours: 60,
    credits: 4,
    syllabus: 'Advanced topics.',
    prerequisites: ['CIN0001'],
  },
];

const validMajor = {
  code: 'CC',
  name: 'Ciência da Computação',
  courses: [
    { code: 'CIN0001', type: 'OBRIGATORIA', recommendedTerm: 1 },
    { code: 'CIN0002', type: 'ELETIVA' },
  ],
};

function issuesOf(raw: { courses: unknown; major: unknown }): readonly string[] {
  try {
    parseCurriculum(raw);
  } catch (error) {
    if (error instanceof CurriculumValidationError) return error.issues;
    throw error;
  }
  throw new Error('expected parseCurriculum to throw');
}

describe('parseCurriculum', () => {
  it('returns typed data for a valid curriculum', () => {
    const curriculum = parseCurriculum({ courses: validCourses, major: validMajor });

    expect(curriculum.major).toEqual({ code: 'CC', name: 'Ciência da Computação' });
    expect(curriculum.courses.map((course) => course.code)).toEqual(['CIN0001', 'CIN0002']);
    expect(curriculum.majorCourses).toEqual([
      { code: 'CIN0001', type: 'OBRIGATORIA', recommendedTerm: 1 },
      { code: 'CIN0002', type: 'ELETIVA', recommendedTerm: null },
    ]);
  });

  it('uses null for a missing syllabus', () => {
    const curriculum = parseCurriculum({ courses: validCourses, major: validMajor });

    expect(curriculum.courses[0]?.syllabus).toBeNull();
    expect(curriculum.courses[1]?.syllabus).toBe('Advanced topics.');
  });

  it('rejects a malformed course code', () => {
    const courses = [{ ...validCourses[0], code: 'intro' }];

    expect(issuesOf({ courses, major: validMajor })).toEqual([
      expect.stringContaining('courses.json: 0.code'),
    ]);
  });

  it('rejects unknown fields so typos do not pass silently', () => {
    const courses = [{ ...validCourses[0], prerequisite: [] }];

    expect(issuesOf({ courses, major: validMajor })).toEqual([
      expect.stringContaining('courses.json: 0'),
    ]);
  });

  it('requires a recommended term for obligatory courses', () => {
    const major = { ...validMajor, courses: [{ code: 'CIN0001', type: 'OBRIGATORIA' }] };

    expect(issuesOf({ courses: validCourses, major })).toEqual([
      expect.stringContaining('major file: courses.0.recommendedTerm'),
    ]);
  });

  it('rejects a major course that is not defined in courses.json', () => {
    const major = {
      ...validMajor,
      courses: [...validMajor.courses, { code: 'CIN0099', type: 'ELETIVA' }],
    };

    expect(issuesOf({ courses: validCourses, major })).toEqual([
      'major CC: course CIN0099 is not defined in courses.json',
    ]);
  });

  it('rejects a course listed twice in the major', () => {
    const major = {
      ...validMajor,
      courses: [...validMajor.courses, { code: 'CIN0001', type: 'ELETIVA' }],
    };

    expect(issuesOf({ courses: validCourses, major })).toEqual([
      'major CC: course CIN0001 is listed more than once',
    ]);
  });

  it('rejects a course that is not listed in the major', () => {
    const major = { ...validMajor, courses: [validMajor.courses[0]] };

    expect(issuesOf({ courses: validCourses, major })).toEqual([
      'courses.json: course CIN0002 is not listed in major CC',
    ]);
  });

  it('rejects a prerequisite that does not exist', () => {
    const courses = [{ ...validCourses[0], prerequisites: ['CIN0099'] }, validCourses[1]];

    expect(issuesOf({ courses, major: validMajor })).toEqual([
      'courses.json: course CIN0001 requires CIN0099, which is not defined',
    ]);
  });

  it('rejects a prerequisite cycle and names the courses', () => {
    const courses = [
      { ...validCourses[0], prerequisites: ['CIN0002'] },
      { ...validCourses[1], prerequisites: ['CIN0001'] },
    ];

    expect(issuesOf({ courses, major: validMajor })).toEqual([
      'courses.json: prerequisite cycle: CIN0001 requires CIN0002 requires CIN0001',
    ]);
  });

  it('reports every problem in one error', () => {
    const courses = [{ ...validCourses[0], prerequisites: ['CIN0099'] }, validCourses[1]];
    const major = { ...validMajor, courses: [validMajor.courses[0]] };

    expect(issuesOf({ courses, major })).toHaveLength(2);
  });
});

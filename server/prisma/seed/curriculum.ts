import { readFileSync } from 'node:fs';
import type { z } from 'zod';
import { validatePrerequisiteGraph, type GraphIssue } from '../../src/domain/prerequisite-graph.js';
import { coursesFileSchema, majorFileSchema } from './curriculum-schema.js';

export interface CurriculumCourse {
  readonly code: string;
  readonly name: string;
  readonly workloadHours: number;
  readonly credits: number;
  readonly syllabus: string | null;
  readonly prerequisites: readonly string[];
}

export interface CurriculumMajorCourse {
  readonly code: string;
  readonly type: 'OBRIGATORIA' | 'ELETIVA';
  readonly recommendedTerm: number | null;
}

export interface Curriculum {
  readonly major: { readonly code: string; readonly name: string };
  readonly courses: readonly CurriculumCourse[];
  readonly majorCourses: readonly CurriculumMajorCourse[];
}

/** Thrown when the curriculum data is invalid. Carries every problem found, not just the first. */
export class CurriculumValidationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(`Invalid curriculum data:\n${issues.map((issue) => `- ${issue}`).join('\n')}`);
    this.name = 'CurriculumValidationError';
    this.issues = issues;
  }
}

function describeZodIssues(source: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.map(String).join('.');
    return `${source}${path === '' ? '' : `: ${path}`}: ${issue.message}`;
  });
}

function describeGraphIssue(issue: GraphIssue): string {
  switch (issue.type) {
    case 'DUPLICATE_COURSE':
      return `courses.json: course ${issue.code} is defined more than once`;
    case 'SELF_PREREQUISITE':
      return `courses.json: course ${issue.code} requires itself`;
    case 'DUPLICATE_PREREQUISITE':
      return `courses.json: course ${issue.code} lists ${issue.required} as prerequisite more than once`;
    case 'UNKNOWN_PREREQUISITE':
      return `courses.json: course ${issue.code} requires ${issue.required}, which is not defined`;
    case 'CYCLE':
      return `courses.json: prerequisite cycle: ${issue.path.join(' requires ')} requires ${issue.path[0]}`;
  }
}

/**
 * Validates raw curriculum data (shape first, then the rules that span both files) and returns it
 * in a typed form. Pure: no file or database access.
 */
export function parseCurriculum(raw: { courses: unknown; major: unknown }): Curriculum {
  const courses = coursesFileSchema.safeParse(raw.courses);
  const major = majorFileSchema.safeParse(raw.major);

  if (!courses.success || !major.success) {
    throw new CurriculumValidationError([
      ...(courses.success ? [] : describeZodIssues('courses.json', courses.error)),
      ...(major.success ? [] : describeZodIssues('major file', major.error)),
    ]);
  }

  const issues = validatePrerequisiteGraph(courses.data).map(describeGraphIssue);

  const courseCodes = new Set(courses.data.map((course) => course.code));
  const codesInMajor = new Set<string>();
  for (const { code } of major.data.courses) {
    if (!courseCodes.has(code)) {
      issues.push(`major ${major.data.code}: course ${code} is not defined in courses.json`);
    }
    if (codesInMajor.has(code)) {
      issues.push(`major ${major.data.code}: course ${code} is listed more than once`);
    }
    codesInMajor.add(code);
  }
  for (const { code } of courses.data) {
    if (!codesInMajor.has(code)) {
      issues.push(`courses.json: course ${code} is not listed in major ${major.data.code}`);
    }
  }

  if (issues.length > 0) throw new CurriculumValidationError(issues);

  return {
    major: { code: major.data.code, name: major.data.name },
    courses: courses.data.map((course) => ({
      code: course.code,
      name: course.name,
      workloadHours: course.workloadHours,
      credits: course.credits,
      syllabus: course.syllabus ?? null,
      prerequisites: [...course.prerequisites],
    })),
    majorCourses: major.data.courses.map((entry) => ({
      code: entry.code,
      type: entry.type,
      recommendedTerm: entry.recommendedTerm ?? null,
    })),
  };
}

const DEFAULT_DATA_DIR = new URL('../../../data/', import.meta.url);

function readJson(url: URL): unknown {
  try {
    return JSON.parse(readFileSync(url, 'utf8')) as unknown;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not read ${url.pathname}: ${reason}`, { cause: error });
  }
}

/** Reads `data/courses.json` and a major file from `data/` and validates them. */
export function loadCurriculum(options: { dataDir?: URL; majorFile?: string } = {}): Curriculum {
  const dataDir = options.dataDir ?? DEFAULT_DATA_DIR;
  const majorFile = options.majorFile ?? 'majors/cc.json';

  return parseCurriculum({
    courses: readJson(new URL('courses.json', dataDir)),
    major: readJson(new URL(majorFile, dataDir)),
  });
}

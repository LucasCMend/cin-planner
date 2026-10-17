import { z } from 'zod';

// Official UFPE codes, e.g. CIN0133 or MA026.
const courseCode = z.string().regex(/^[A-Z]{2,4}\d{3,4}$/, 'expected a course code like CIN0133');

const course = z.strictObject({
  code: courseCode,
  name: z.string().min(1),
  workloadHours: z.number().int().positive(),
  credits: z.number().int().positive(),
  syllabus: z.string().min(1).optional(),
  prerequisites: z.array(courseCode),
});

// Obligatory courses have a recommended term; electives may not.
const majorCourse = z.discriminatedUnion('type', [
  z.strictObject({
    code: courseCode,
    type: z.literal('OBRIGATORIA'),
    recommendedTerm: z.number().int().min(1),
  }),
  z.strictObject({
    code: courseCode,
    type: z.literal('ELETIVA'),
    recommendedTerm: z.number().int().min(1).optional(),
  }),
]);

export const coursesFileSchema = z.array(course);

export const majorFileSchema = z.strictObject({
  code: z.string().min(1),
  name: z.string().min(1),
  courses: z.array(majorCourse),
});

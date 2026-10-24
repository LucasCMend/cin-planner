import { z } from 'zod';

// Edge table: no update, an edge is created or deleted.
export const CreateCoursePrerequisiteDTO = z.object({
  courseId: z.int().positive(),
  requiredCourseId: z.int().positive()
});

export type CreateCoursePrerequisiteInput = z.infer<typeof CreateCoursePrerequisiteDTO>;

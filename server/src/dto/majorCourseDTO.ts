import { z } from 'zod';

export const CreateMajorCourseDTO = z.object({
  majorId: z.int().positive(),
  courseId: z.int().positive(),
  type: z.enum(['OBRIGATORIA', 'ELETIVA']),
  recommendedTerm: z.int().positive().max(20).nullable().optional()
});

export const UpdateMajorCourseDTO = CreateMajorCourseDTO.omit({ majorId: true, courseId: true }).partial();

export type CreateMajorCourseInput = z.infer<typeof CreateMajorCourseDTO>;
export type UpdateMajorCourseInput = z.infer<typeof UpdateMajorCourseDTO>;

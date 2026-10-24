import { z } from 'zod';

export const CreateUserCourseDTO = z.object({
  userId: z.int().positive(),
  courseId: z.int().positive(),
  status: z.enum(['CURSADA', 'CURSANDO']),
  termLabel: z.string().trim().min(1),
  grade: z.number().min(0).max(10).nullable().optional()
});

export const UpdateUserCourseDTO = CreateUserCourseDTO.omit({ userId: true, courseId: true }).partial();

export type CreateUserCourseInput = z.infer<typeof CreateUserCourseDTO>;
export type UpdateUserCourseInput = z.infer<typeof UpdateUserCourseDTO>;

import { z } from 'zod';

export const CreateCourseDTO = z.object({
  code: z
    .string()
    .trim()
    .regex(/^[A-Z]+\d+$/, 'o Código deve ser formados por letras maiúsculas seguidas por números'),
  name: z.string().trim().min(1),
  workloadHours: z.int().positive().max(500),
  credits: z.int().positive().max(40),
  syllabus: z.string().trim()
});

export const UpdateCourseDTO = CreateCourseDTO.omit({ code: true }).partial();

export type CreateCourseInput = z.infer<typeof CreateCourseDTO>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseDTO>;

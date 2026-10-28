import { z } from 'zod';

export const CourseStatusDTO = z.object({
  userId: z.int().positive(),
  code: z
    .string()
    .trim()
    .regex(
      /^[A-Z]+\d+$/,
      'O código deve ser formado por letras maiúsculas seguidas por números',
    ),
});

export type CourseStatusInput = z.infer<typeof CourseStatusDTO>;

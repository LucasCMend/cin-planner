import { z } from 'zod';

export const ValidateTermDTO = z.object({
  userId: z.int().positive(),
  courses: z
    .array(
      z
        .string()
        .trim()
        .regex(
          /^[A-Z]+\d+$/,
          'O código deve ser formado por letras maiúsculas seguidas por números',
        ),
    )
    .min(1, 'É necessário informar pelo menos uma disciplina')
    .refine(
      (courses) => new Set(courses).size === courses.length,
      'A lista não pode conter disciplinas duplicadas',
    ),
});

export type ValidateTermInput = z.infer<typeof ValidateTermDTO>;
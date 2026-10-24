import { z } from 'zod';

export const CreateUserDTO = z.object({
  email: z.email().trim(),
  name: z.string().trim().min(1),
  majorId: z.int().positive()
});

export const UpdateUserDTO = CreateUserDTO.omit({ email: true }).partial();

export type CreateUserInput = z.infer<typeof CreateUserDTO>;
export type UpdateUserInput = z.infer<typeof UpdateUserDTO>;

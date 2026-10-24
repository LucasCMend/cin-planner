import { z } from 'zod';

export const CreateMajorDTO = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(1)
});

export const UpdateMajorDTO = CreateMajorDTO.omit({ code: true }).partial();

export type CreateMajorInput = z.infer<typeof CreateMajorDTO>;
export type UpdateMajorInput = z.infer<typeof UpdateMajorDTO>;

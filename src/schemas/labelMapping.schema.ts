import { z } from 'zod';

export const LabelMappingSchema = z.object({
  userId: z.string(),
  labels: z.object({
    review: z.string(),
    archive: z.string(),
    junk: z.string(),
  }),
});

export type LabelMappingDTO = z.infer<typeof LabelMappingSchema>;

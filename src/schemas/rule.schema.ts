import { z } from 'zod';

export const RuleTypeSchema = z.enum(['promotions_age','list_unsubscribe','auth_weak','sender_new','keyword']);

export const RuleSchema = z.object({
  id: z.string(),
  type: RuleTypeSchema,
  params: z.record(z.any()),
  enabled: z.boolean(),
  priority: z.number().int(),
  createdAt: z.string(),
});

export type RuleDTO = z.infer<typeof RuleSchema>;

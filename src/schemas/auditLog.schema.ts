import { z } from 'zod';
import { ProposedActionSchema } from './messageCandidate.schema';

export const AuditLogSchema = z.object({
  messageId: z.string(),
  action: ProposedActionSchema,
  ruleId: z.string().optional(),
  timestamp: z.string(),
});

export type AuditLogDTO = z.infer<typeof AuditLogSchema>;

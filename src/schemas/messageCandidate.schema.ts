import { z } from 'zod';

export const ProposedActionSchema = z.enum(['move_to_spam','archive','label_review']);

export const MessageSignalsSchema = z.object({
  hasListUnsubscribe: z.boolean().optional(),
  authResults: z.string().optional(),
  dkim: z.string().optional(),
  spf: z.string().optional(),
  from: z.string().optional(),
});

export const MessageCandidateSchema = z.object({
  messageId: z.string(),
  signals: MessageSignalsSchema,
  appliedRuleId: z.string().optional(),
  proposedAction: ProposedActionSchema,
});

export type MessageCandidateDTO = z.infer<typeof MessageCandidateSchema>;

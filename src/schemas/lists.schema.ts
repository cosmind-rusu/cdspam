import { z } from 'zod';

export const WhitelistEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  senderOrDomain: z.string(),
  createdAt: z.string(),
});

export const BlacklistEntrySchema = WhitelistEntrySchema; // same shape

export type WhitelistEntryDTO = z.infer<typeof WhitelistEntrySchema>;
export type BlacklistEntryDTO = z.infer<typeof BlacklistEntrySchema>;

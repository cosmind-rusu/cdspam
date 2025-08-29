import type { Rule } from '../models/Rule';
import type { WhitelistEntry } from '../models/Lists';
import type { LabelMapping } from '../models/LabelMapping';
import type { AuditLog } from '../models/AuditLog';
import type { MessageCandidate } from '../models/MessageCandidate';

export interface Storage {
  putRule(userId: string, rule: Rule): Promise<void>;
  listRules(userId: string): Promise<Rule[]>;

  upsertWhitelistEntry(userId: string, entry: WhitelistEntry): Promise<void>;
  listWhitelist(userId: string): Promise<WhitelistEntry[]>;

  setLabelMapping(userId: string, mapping: LabelMapping): Promise<void>;
  getLabelMapping(userId: string): Promise<LabelMapping | null>;

  putMessageCandidate(userId: string, candidate: MessageCandidate): Promise<void>;
  listMessageCandidates(userId: string, limit?: number): Promise<MessageCandidate[]>;

  addAuditLog(userId: string, log: AuditLog): Promise<void>;
  listAuditLogs(userId: string, limit?: number): Promise<AuditLog[]>;
}

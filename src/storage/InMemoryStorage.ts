import type { Storage } from './Storage';
import type { Rule } from '../models/Rule';
import type { WhitelistEntry } from '../models/Lists';
import type { LabelMapping } from '../models/LabelMapping';
import type { AuditLog } from '../models/AuditLog';
import type { MessageCandidate } from '../models/MessageCandidate';

export class InMemoryStorage implements Storage {
  private rules = new Map<string, Map<string, Rule>>();
  private whitelist = new Map<string, Map<string, WhitelistEntry>>();
  private labelMappings = new Map<string, LabelMapping>();
  private candidates = new Map<string, Map<string, MessageCandidate>>();
  private auditLogs = new Map<string, AuditLog[]>();

  async putRule(userId: string, rule: Rule): Promise<void> {
    const m = this.rules.get(userId) ?? new Map<string, Rule>();
    m.set(rule.id, rule);
    this.rules.set(userId, m);
  }

  async listRules(userId: string): Promise<Rule[]> {
    const m = this.rules.get(userId);
    return m ? Array.from(m.values()).sort((a, b) => a.priority - b.priority) : [];
  }

  async upsertWhitelistEntry(userId: string, entry: WhitelistEntry): Promise<void> {
    const m = this.whitelist.get(userId) ?? new Map<string, WhitelistEntry>();
    m.set(entry.id, entry);
    this.whitelist.set(userId, m);
  }

  async listWhitelist(userId: string): Promise<WhitelistEntry[]> {
    const m = this.whitelist.get(userId);
    return m ? Array.from(m.values()) : [];
  }

  async setLabelMapping(userId: string, mapping: LabelMapping): Promise<void> {
    this.labelMappings.set(userId, mapping);
  }

  async getLabelMapping(userId: string): Promise<LabelMapping | null> {
    return this.labelMappings.get(userId) ?? null;
  }

  async putMessageCandidate(userId: string, candidate: MessageCandidate): Promise<void> {
    const m = this.candidates.get(userId) ?? new Map<string, MessageCandidate>();
    m.set(candidate.messageId, candidate);
    this.candidates.set(userId, m);
  }

  async listMessageCandidates(userId: string, limit = 50): Promise<MessageCandidate[]> {
    const m = this.candidates.get(userId);
    const arr = m ? Array.from(m.values()) : [];
    return arr.slice(0, limit);
  }

  async addAuditLog(userId: string, log: AuditLog): Promise<void> {
    const arr = this.auditLogs.get(userId) ?? [];
    arr.push(log);
    this.auditLogs.set(userId, arr);
  }

  async listAuditLogs(userId: string, limit = 100): Promise<AuditLog[]> {
    const arr = this.auditLogs.get(userId) ?? [];
    const copy = [...arr].reverse();
    return copy.slice(0, limit);
  }
}

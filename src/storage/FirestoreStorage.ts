import { Firestore } from '@google-cloud/firestore';
import type { Storage } from './Storage';
import type { Rule } from '../models/Rule';
import type { WhitelistEntry } from '../models/Lists';
import type { LabelMapping } from '../models/LabelMapping';
import type { AuditLog } from '../models/AuditLog';
import type { MessageCandidate } from '../models/MessageCandidate';

export class FirestoreStorage implements Storage {
  constructor(private db: Firestore) {}

  private userDoc(userId: string) {
    return this.db.collection('users').doc(userId);
  }

  async putRule(userId: string, rule: Rule): Promise<void> {
    await this.userDoc(userId).collection('rules').doc(rule.id).set(rule, { merge: true });
  }

  async listRules(userId: string): Promise<Rule[]> {
    const snap = await this.userDoc(userId).collection('rules').orderBy('priority', 'asc').get();
    return snap.docs.map((d) => d.data() as Rule);
  }

  async upsertWhitelistEntry(userId: string, entry: WhitelistEntry): Promise<void> {
    await this.userDoc(userId).collection('whitelist').doc(entry.id).set(entry, { merge: true });
  }

  async listWhitelist(userId: string): Promise<WhitelistEntry[]> {
    const snap = await this.userDoc(userId).collection('whitelist').get();
    return snap.docs.map((d) => d.data() as WhitelistEntry);
  }

  async setLabelMapping(userId: string, mapping: LabelMapping): Promise<void> {
    await this.userDoc(userId).collection('config').doc('labelMapping').set(mapping);
  }

  async getLabelMapping(userId: string): Promise<LabelMapping | null> {
    const doc = await this.userDoc(userId).collection('config').doc('labelMapping').get();
    return doc.exists ? (doc.data() as LabelMapping) : null;
  }

  async putMessageCandidate(userId: string, candidate: MessageCandidate): Promise<void> {
    await this.userDoc(userId).collection('candidates').doc(candidate.messageId).set(candidate, { merge: true });
  }

  async listMessageCandidates(userId: string, limit = 50): Promise<MessageCandidate[]> {
    const snap = await this.userDoc(userId).collection('candidates').limit(limit).get();
    return snap.docs.map((d) => d.data() as MessageCandidate);
  }

  async addAuditLog(userId: string, log: AuditLog): Promise<void> {
    await this.userDoc(userId).collection('auditLogs').add(log);
  }

  async listAuditLogs(userId: string, limit = 100): Promise<AuditLog[]> {
    const snap = await this.userDoc(userId).collection('auditLogs').orderBy('timestamp', 'desc').limit(limit).get();
    return snap.docs.map((d) => d.data() as AuditLog);
  }
}

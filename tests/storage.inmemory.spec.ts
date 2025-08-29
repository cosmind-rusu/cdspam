import { describe, it, expect } from 'vitest';
import { InMemoryStorage } from '../src/storage/InMemoryStorage';
import type { Rule } from '../src/models/Rule';

const userId = 'u1';

describe('InMemoryStorage', () => {
  it('stores and lists rules ordered by priority', async () => {
    const s = new InMemoryStorage();
    const r1: Rule = { id: 'r1', type: 'keyword', params: { k: 'a' }, enabled: true, priority: 20, createdAt: '2025-01-01T00:00:00Z' };
    const r2: Rule = { id: 'r2', type: 'list_unsubscribe', params: {}, enabled: true, priority: 10, createdAt: '2025-01-02T00:00:00Z' };
    await s.putRule(userId, r1);
    await s.putRule(userId, r2);
    const list = await s.listRules(userId);
    expect(list.map(r => r.id)).toEqual(['r2', 'r1']);
  });

  it('handles whitelist upsert/list', async () => {
    const s = new InMemoryStorage();
    await s.upsertWhitelistEntry(userId, { id: 'w1', userId, senderOrDomain: 'example.com', createdAt: '2025-01-01T00:00:00Z' });
    const wl = await s.listWhitelist(userId);
    expect(wl.length).toBe(1);
    expect(wl[0].senderOrDomain).toBe('example.com');
  });

  it('sets and gets label mapping', async () => {
    const s = new InMemoryStorage();
    await s.setLabelMapping(userId, { userId, labels: { review: 'L1', archive: 'L2', junk: 'L3' } });
    const lm = await s.getLabelMapping(userId);
    expect(lm?.labels.junk).toBe('L3');
  });

  it('stores and lists message candidates', async () => {
    const s = new InMemoryStorage();
    await s.putMessageCandidate(userId, { messageId: 'm1', signals: { from: 'a@b.com' }, proposedAction: 'archive' });
    await s.putMessageCandidate(userId, { messageId: 'm2', signals: { from: 'c@d.com' }, proposedAction: 'label_review' });
    const list = await s.listMessageCandidates(userId, 1);
    expect(list.length).toBe(1);
    expect(['m1','m2']).toContain(list[0].messageId);
  });

  it('adds and lists audit logs newest first', async () => {
    const s = new InMemoryStorage();
    await s.addAuditLog(userId, { messageId: 'm1', action: 'archive', timestamp: '2025-01-03T00:00:00Z' });
    await s.addAuditLog(userId, { messageId: 'm2', action: 'move_to_spam', timestamp: '2025-01-04T00:00:00Z' });
    const logs = await s.listAuditLogs(userId, 10);
    expect(logs[0].messageId).toBe('m2');
    expect(logs[1].messageId).toBe('m1');
  });
});

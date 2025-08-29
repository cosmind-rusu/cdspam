import { describe, it, beforeEach, afterAll, expect } from 'vitest';
import { Firestore } from '@google-cloud/firestore';
import { FirestoreStorage } from '../../src/storage/FirestoreStorage';
import type { Rule } from '../../src/models/Rule';

const userId = 'u1';

const projectId = 'demo-test';
const db = new Firestore({ projectId });
const storage = new FirestoreStorage(db);

async function wipeUser(user: string) {
  const subcols = ['rules', 'whitelist', 'candidates', 'auditLogs'];
  for (const c of subcols) {
    const docs = await db.collection('users').doc(user).collection(c).listDocuments();
    await Promise.all(docs.map((d) => d.delete()));
  }
  await db.collection('users').doc(user).collection('config').doc('labelMapping').delete().catch(() => {});
}

beforeEach(async () => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    // Si no hay emulador, no ejecutamos (CI lo define vía firebase emulators:exec)
    return;
  }
  await wipeUser(userId);
});

afterAll(async () => {
  await db.terminate();
});

describe('FirestoreStorage (emulator)', () => {
  it('put/list rules', async () => {
    if (!process.env.FIRESTORE_EMULATOR_HOST) return expect(true).toBe(true);
    const r1: Rule = { id: 'r1', type: 'keyword', params: { k: 'a' }, enabled: true, priority: 20, createdAt: '2025-01-01T00:00:00Z' };
    const r2: Rule = { id: 'r2', type: 'list_unsubscribe', params: {}, enabled: true, priority: 10, createdAt: '2025-01-02T00:00:00Z' };
    await storage.putRule(userId, r1);
    await storage.putRule(userId, r2);
    const list = await storage.listRules(userId);
    expect(list.map(r => r.id)).toEqual(['r2','r1']);
  });

  it('set/get label mapping', async () => {
    if (!process.env.FIRESTORE_EMULATOR_HOST) return expect(true).toBe(true);
    await storage.setLabelMapping(userId, { userId, labels: { review: 'L1', archive: 'L2', junk: 'L3' } });
    const lm = await storage.getLabelMapping(userId);
    expect(lm?.labels.archive).toBe('L2');
  });

  it('candidates and audit logs', async () => {
    if (!process.env.FIRESTORE_EMULATOR_HOST) return expect(true).toBe(true);
    await storage.putMessageCandidate(userId, { messageId: 'm1', signals: { from: 'a@b.com' }, proposedAction: 'archive' });
    const cands = await storage.listMessageCandidates(userId, 10);
    expect(cands.length).toBe(1);
    await storage.addAuditLog(userId, { messageId: 'm1', action: 'archive', timestamp: '2025-01-02T00:00:00Z' });
    const logs = await storage.listAuditLogs(userId, 10);
    expect(logs[0].messageId).toBe('m1');
  });
});

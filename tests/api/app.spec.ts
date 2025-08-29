import { describe, it, expect } from 'vitest';
import { buildApp } from '../../src/server/app';
import { InMemoryStorage } from '../../src/storage/InMemoryStorage';

const userId = 'u1';

describe('API (Fastify)', () => {
  it('GET /healthz', async () => {
    const app = buildApp({ storage: new InMemoryStorage() });
    const res = await app.inject({ method: 'GET', url: '/healthz' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.ok).toBe(true);
  });

  it('POST/GET rules', async () => {
    const app = buildApp({ storage: new InMemoryStorage() });
    const r1 = { id: 'r1', type: 'keyword', params: { k: 'x' }, enabled: true, priority: 20, createdAt: '2025-01-01T00:00:00Z' };
    const r2 = { id: 'r2', type: 'list_unsubscribe', params: {}, enabled: true, priority: 10, createdAt: '2025-01-02T00:00:00Z' };
    const p1 = await app.inject({ method: 'POST', url: `/users/${userId}/rules`, payload: r1 });
    expect(p1.statusCode).toBe(201);
    const p2 = await app.inject({ method: 'POST', url: `/users/${userId}/rules`, payload: r2 });
    expect(p2.statusCode).toBe(201);
    const g = await app.inject({ method: 'GET', url: `/users/${userId}/rules` });
    expect(g.statusCode).toBe(200);
    const rules = g.json();
    expect(rules.map((r: any) => r.id)).toEqual(['r2', 'r1']);
  });

  it('whitelist upsert/list', async () => {
    const app = buildApp({ storage: new InMemoryStorage() });
    const entry = { id: 'w1', userId, senderOrDomain: 'example.com', createdAt: '2025-01-01T00:00:00Z' };
    const p = await app.inject({ method: 'POST', url: `/users/${userId}/whitelist`, payload: entry });
    expect(p.statusCode).toBe(201);
    const g = await app.inject({ method: 'GET', url: `/users/${userId}/whitelist` });
    expect(g.statusCode).toBe(200);
    const wl = g.json();
    expect(wl.length).toBe(1);
  });

  it('labels set/get', async () => {
    const app = buildApp({ storage: new InMemoryStorage() });
    const lm = { userId, labels: { review: 'L1', archive: 'L2', junk: 'L3' } };
    const p = await app.inject({ method: 'PUT', url: `/users/${userId}/labels`, payload: lm });
    expect(p.statusCode).toBe(200);
    const g = await app.inject({ method: 'GET', url: `/users/${userId}/labels` });
    const body = g.json();
    expect(body.labels.archive).toBe('L2');
  });

  it('candidates and audit', async () => {
    const app = buildApp({ storage: new InMemoryStorage() });
    const cand = { messageId: 'm1', signals: { from: 'a@b.com' }, proposedAction: 'archive' };
    const pc = await app.inject({ method: 'POST', url: `/users/${userId}/candidates`, payload: cand });
    expect(pc.statusCode).toBe(201);
    const gc = await app.inject({ method: 'GET', url: `/users/${userId}/candidates?limit=5` });
    expect(gc.statusCode).toBe(200);
    const list = gc.json();
    expect(list.length).toBe(1);

    const log = { messageId: 'm1', action: 'archive', timestamp: '2025-01-02T00:00:00Z' };
    const pa = await app.inject({ method: 'POST', url: `/users/${userId}/audit`, payload: log });
    expect(pa.statusCode).toBe(201);
    const ga = await app.inject({ method: 'GET', url: `/users/${userId}/audit?limit=10` });
    expect(ga.statusCode).toBe(200);
    const logs = ga.json();
    expect(logs[0].messageId).toBe('m1');
  });
});

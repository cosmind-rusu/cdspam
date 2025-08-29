import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { RuleSchema } from '../schemas/rule.schema';
import { WhitelistEntrySchema } from '../schemas/lists.schema';
import { LabelMappingSchema } from '../schemas/labelMapping.schema';
import { MessageCandidateSchema } from '../schemas/messageCandidate.schema';
import { AuditLogSchema } from '../schemas/auditLog.schema';
import { createStorage } from '../storage/StorageFactory';
import type { Storage } from '../storage/Storage';

export function buildApp(opts?: { storage?: Storage }): FastifyInstance {
  const app = Fastify();
  const storage = opts?.storage ?? createStorage();

  // Health
  app.get('/healthz', async () => ({ ok: true }));

  // Rules
  app.get('/users/:userId/rules', async (req, res) => {
    const { userId } = req.params as { userId: string };
    const rules = await storage.listRules(userId);
    return res.send(rules);
  });

  app.post('/users/:userId/rules', async (req, res) => {
    const { userId } = req.params as { userId: string };
    const rule = RuleSchema.parse(req.body);
    await storage.putRule(userId, rule);
    return res.code(201).send({ ok: true });
  });

  // Whitelist
  app.get('/users/:userId/whitelist', async (req, res) => {
    const { userId } = req.params as { userId: string };
    const wl = await storage.listWhitelist(userId);
    return res.send(wl);
  });

  app.post('/users/:userId/whitelist', async (req, res) => {
    const { userId } = req.params as { userId: string };
    const entry = WhitelistEntrySchema.parse(req.body);
    await storage.upsertWhitelistEntry(userId, entry);
    return res.code(201).send({ ok: true });
  });

  // Labels
  app.get('/users/:userId/labels', async (req, res) => {
    const { userId } = req.params as { userId: string };
    const mapping = await storage.getLabelMapping(userId);
    return res.send(mapping);
  });

  app.put('/users/:userId/labels', async (req, res) => {
    const { userId } = req.params as { userId: string };
    const mapping = LabelMappingSchema.parse(req.body);
    await storage.setLabelMapping(userId, mapping);
    return res.send({ ok: true });
  });

  // Candidates
  app.get('/users/:userId/candidates', async (req, res) => {
    const { userId } = req.params as { userId: string };
    const { limit } = (req.query as { limit?: string }) ?? {};
    const n = limit ? Math.max(1, Math.min(200, Number(limit))) : 50;
    const cands = await storage.listMessageCandidates(userId, n);
    return res.send(cands);
  });

  app.post('/users/:userId/candidates', async (req, res) => {
    const { userId } = req.params as { userId: string };
    const cand = MessageCandidateSchema.parse(req.body);
    await storage.putMessageCandidate(userId, cand);
    return res.code(201).send({ ok: true });
  });

  // Audit
  app.get('/users/:userId/audit', async (req, res) => {
    const { userId } = req.params as { userId: string };
    const { limit } = (req.query as { limit?: string }) ?? {};
    const n = limit ? Math.max(1, Math.min(1000, Number(limit))) : 100;
    const logs = await storage.listAuditLogs(userId, n);
    return res.send(logs);
  });

  app.post('/users/:userId/audit', async (req, res) => {
    const { userId } = req.params as { userId: string };
    const log = AuditLogSchema.parse(req.body);
    await storage.addAuditLog(userId, log);
    return res.code(201).send({ ok: true });
  });

  return app;
}

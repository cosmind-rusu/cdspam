import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { RuleSchema } from '../src/schemas/rule.schema.js';
import { WhitelistEntrySchema } from '../src/schemas/lists.schema.js';
import { MessageCandidateSchema } from '../src/schemas/messageCandidate.schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJSON(rel: string) {
  const p = path.join(__dirname, '..', rel);
  const raw = readFileSync(p, 'utf-8');
  return JSON.parse(raw);
}

describe('Schemas validate fixtures', () => {
  it('validates rules.sample.json', () => {
    const data = loadJSON('fixtures/rules.sample.json');
    expect(Array.isArray(data)).toBe(true);
    for (const r of data) {
      const parsed = RuleSchema.parse(r);
      expect(parsed.enabled).toBeTypeOf('boolean');
    }
  });

  it('validates whitelist.sample.json', () => {
    const data = loadJSON('fixtures/whitelist.sample.json');
    for (const w of data) {
      const parsed = WhitelistEntrySchema.parse(w);
      expect(parsed.senderOrDomain).toBeTypeOf('string');
    }
  });

  it('validates messages.sample.json', () => {
    const data = loadJSON('fixtures/messages.sample.json');
    for (const m of data) {
      const parsed = MessageCandidateSchema.parse(m);
      expect(parsed.messageId).toBeTypeOf('string');
    }
  });
});

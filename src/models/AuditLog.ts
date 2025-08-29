import type { ProposedAction } from './common.js';

export interface AuditLog {
  messageId: string;
  action: ProposedAction;
  ruleId?: string;
  timestamp: string; // ISO date
}

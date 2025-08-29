import type { ProposedAction } from './common';

export interface AuditLog {
  messageId: string;
  action: ProposedAction;
  ruleId?: string;
  timestamp: string; // ISO date
}

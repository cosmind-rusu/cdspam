import type { ProposedAction } from './common';

export interface HeaderKV {
  name: string;
  value: string;
}

export interface MessageSignals {
  hasListUnsubscribe?: boolean;
  authResults?: string;
  dkim?: string;
  spf?: string;
  from?: string;
}

export interface MessageCandidate {
  messageId: string;
  signals: MessageSignals;
  appliedRuleId?: string;
  proposedAction: ProposedAction;
}

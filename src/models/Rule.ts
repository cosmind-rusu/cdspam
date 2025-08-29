export type RuleType = 'promotions_age' | 'list_unsubscribe' | 'auth_weak' | 'sender_new' | 'keyword';

export interface Rule {
  id: string;
  type: RuleType;
  params: Record<string, unknown>;
  enabled: boolean;
  priority: number; // lower first
  createdAt: string; // ISO date
}

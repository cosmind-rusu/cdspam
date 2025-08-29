export type UnsubscribeType = 'http' | 'mailto';

export interface UnsubscribeTask {
  userId: string;
  messageId: string;
  type: UnsubscribeType;
  urlOrMailto: string;
  status: 'pending' | 'done' | 'failed';
  lastTriedAt?: string; // ISO date
}

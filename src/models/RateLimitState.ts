export interface RateLimitState {
  userId: string;
  lastErrorAt?: string; // ISO date
  backoffSeconds?: number;
}

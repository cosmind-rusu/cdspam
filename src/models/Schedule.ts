export interface Schedule {
  userId: string;
  frequencyHours: number;
  lastRunAt?: string; // ISO date
  enabled: boolean;
}

export interface SleepLog {
  id: string;
  userId: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number | null;
  quality: number;
  notes: string | null;
  exercise: boolean;
  caffeine: boolean;
  alcohol: boolean;
  stress: number;
  screenTime: boolean;
  aiInsight: string | null;
  weeklyReport: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSleepLogInput {
  date?: string;
  bedtime: string;
  wakeTime: string;
  quality: number;
  notes?: string;
  exercise?: boolean;
  caffeine?: boolean;
  alcohol?: boolean;
  stress?: number;
  screenTime?: boolean;
}

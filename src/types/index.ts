export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  scheduledDate: string | null; // ISO date string
  createdAt: string;
  completedAt?: string;
}

export interface DailyReviewState {
  lastReviewDate: string | null;
  pendingTasksForReview: string[]; // task IDs
}

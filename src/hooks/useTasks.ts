import { useState, useEffect } from 'react';
import type { Task, DailyReviewState } from '../types';
import { isToday, parseISO, startOfDay, format, isBefore } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const REVIEW_KEY = 'daily-todo-review';
const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5173';

export const useTasks = () => {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyReview, setDailyReview] = useState<DailyReviewState>({
    lastReviewDate: null,
    pendingTasksForReview: [],
  });
  const [showDailyReview, setShowDailyReview] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load tasks from API
  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    loadTasks();
  }, [user, token]);

  // Load daily review state
  useEffect(() => {
    const storedReview = localStorage.getItem(REVIEW_KEY);

    if (storedReview) {
      const review = JSON.parse(storedReview);
      setDailyReview(review);

      // Check if we need to show daily review
      const lastReview = review.lastReviewDate
        ? parseISO(review.lastReviewDate)
        : null;

      if (!lastReview || !isToday(lastReview)) {
        checkPendingTasks();
      }
    } else {
      checkPendingTasks();
    }
  }, [tasks]);

  // Save review state to localStorage
  useEffect(() => {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(dailyReview));
  }, [dailyReview]);

  const loadTasks = async () => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load tasks');
      }

      const data = await response.json();

      // Convert API format to app format
      const formattedTasks: Task[] = (data || []).map((task: any) => ({
        id: task.id.toString(),
        title: task.title,
        description: task.description || undefined,
        status: task.status as 'pending' | 'completed',
        scheduledDate: task.scheduled_date,
        createdAt: task.created_at,
        completedAt: task.completed_at || undefined,
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
    setLoading(false);
  };

  const checkPendingTasks = () => {
    const today = startOfDay(new Date());
    const pendingTasks = tasks.filter((t) => {
      if (t.status !== 'pending') return false;
      if (!t.scheduledDate) return true; // Unscheduled tasks
      const scheduledDate = parseISO(t.scheduledDate);
      return isBefore(scheduledDate, today); // Overdue tasks
    });

    if (pendingTasks.length > 0) {
      setDailyReview({
        lastReviewDate: dailyReview.lastReviewDate,
        pendingTasksForReview: pendingTasks.map((t) => t.id),
      });
      setShowDailyReview(true);
    }
  };

  const addTask = async (title: string, description?: string) => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description: description || undefined,
          status: 'pending',
          scheduledDate: format(startOfDay(new Date()), 'yyyy-MM-dd'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const data = await response.json();
      const formattedTask: Task = {
        id: data.id.toString(),
        title: data.title,
        description: data.description || undefined,
        status: data.status as 'pending' | 'completed',
        scheduledDate: data.scheduled_date,
        createdAt: data.created_at,
        completedAt: data.completed_at || undefined,
      };
      setTasks((prev) => [formattedTask, ...prev]);
      return formattedTask;
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user || !token) return;

    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined)
        dbUpdates.description = updates.description || null;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.scheduledDate !== undefined)
        dbUpdates.scheduledDate = updates.scheduledDate;
      if (updates.completedAt !== undefined)
        dbUpdates.completedAt = updates.completedAt;

      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dbUpdates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const scheduleTask = (id: string, date: Date | null) => {
    const dateString = date ? format(startOfDay(date), 'yyyy-MM-dd') : null;
    updateTask(id, { scheduledDate: dateString });
  };

  const completeTask = (id: string) => {
    updateTask(id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
  };

  const completeDailyReview = () => {
    setDailyReview({
      lastReviewDate: new Date().toISOString(),
      pendingTasksForReview: [],
    });
    setShowDailyReview(false);
  };

  const skipDailyReview = () => {
    setShowDailyReview(false);
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    scheduleTask,
    completeTask,
    showDailyReview,
    dailyReview,
    completeDailyReview,
    skipDailyReview,
  };
};

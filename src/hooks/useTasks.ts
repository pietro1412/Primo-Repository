import { useState, useEffect } from 'react';
import type { Task, DailyReviewState } from '../types';
import { isToday, parseISO, startOfDay, format, isBefore } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const REVIEW_KEY = 'daily-todo-review';

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyReview, setDailyReview] = useState<DailyReviewState>({
    lastReviewDate: null,
    pendingTasksForReview: [],
  });
  const [showDailyReview, setShowDailyReview] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load tasks from Supabase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadTasks();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

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
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading tasks:', error);
    } else {
      // Convert Supabase format to app format
      const formattedTasks: Task[] = (data || []).map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        status: task.status as 'pending' | 'completed',
        scheduledDate: task.scheduled_date,
        createdAt: task.created_at,
        completedAt: task.completed_at || undefined,
      }));
      setTasks(formattedTasks);
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
    if (!user) return;

    const newTask = {
      user_id: user.id,
      title,
      description: description || null,
      status: 'pending' as const,
      scheduled_date: format(startOfDay(new Date()), 'yyyy-MM-dd'),
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
    } else if (data) {
      const formattedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        status: data.status as 'pending' | 'completed',
        scheduledDate: data.scheduled_date,
        createdAt: data.created_at,
        completedAt: data.completed_at || undefined,
      };
      setTasks((prev) => [formattedTask, ...prev]);
      return formattedTask;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined)
      dbUpdates.description = updates.description || null;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.scheduledDate !== undefined)
      dbUpdates.scheduled_date = updates.scheduledDate;
    if (updates.completedAt !== undefined)
      dbUpdates.completed_at = updates.completedAt;

    const { error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating task:', error);
    } else {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        )
      );
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      setTasks((prev) => prev.filter((task) => task.id !== id));
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

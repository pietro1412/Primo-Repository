import { useState, useEffect } from 'react';
import type { Task, DailyReviewState } from '../types';
import { isToday, parseISO, startOfDay, format } from 'date-fns';

const TASKS_KEY = 'daily-todo-tasks';
const REVIEW_KEY = 'daily-todo-review';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyReview, setDailyReview] = useState<DailyReviewState>({
    lastReviewDate: null,
    pendingTasksForReview: [],
  });
  const [showDailyReview, setShowDailyReview] = useState(false);

  // Load tasks and review state from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem(TASKS_KEY);
    const storedReview = localStorage.getItem(REVIEW_KEY);

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    if (storedReview) {
      const review = JSON.parse(storedReview);
      setDailyReview(review);

      // Check if we need to show daily review
      const lastReview = review.lastReviewDate
        ? parseISO(review.lastReviewDate)
        : null;

      if (!lastReview || !isToday(lastReview)) {
        // Find pending unscheduled tasks
        const loadedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
        const pendingTasks = loadedTasks.filter(
          t => t.status === 'pending' && !t.scheduledDate
        );

        if (pendingTasks.length > 0) {
          setDailyReview({
            lastReviewDate: review.lastReviewDate,
            pendingTasksForReview: pendingTasks.map(t => t.id),
          });
          setShowDailyReview(true);
        }
      }
    } else {
      // First time - check for pending tasks
      const loadedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
      const pendingTasks = loadedTasks.filter(
        t => t.status === 'pending' && !t.scheduledDate
      );

      if (pendingTasks.length > 0) {
        setDailyReview({
          lastReviewDate: null,
          pendingTasksForReview: pendingTasks.map(t => t.id),
        });
        setShowDailyReview(true);
      }
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  // Save review state to localStorage
  useEffect(() => {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(dailyReview));
  }, [dailyReview]);

  const addTask = (title: string, description?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'pending',
      scheduledDate: null,
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
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

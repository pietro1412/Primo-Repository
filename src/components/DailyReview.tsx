import { useState } from 'react';
import type { Task } from '../types';
import { format } from 'date-fns';

interface DailyReviewProps {
  tasks: Task[];
  onScheduleToday: (taskId: string) => void;
  onScheduleLater: (taskId: string, date: Date) => void;
  onComplete: () => void;
  onSkip: () => void;
}

export const DailyReview = ({
  tasks,
  onScheduleToday,
  onScheduleLater,
  onComplete,
  onSkip,
}: DailyReviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [laterDate, setLaterDate] = useState(
    format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')
  );

  if (tasks.length === 0) {
    onComplete();
    return null;
  }

  const currentTask = tasks[currentIndex];
  const progress = ((currentIndex + 1) / tasks.length) * 100;

  const handleScheduleToday = () => {
    onScheduleToday(currentTask.id);
    moveToNext();
  };

  const handleScheduleLater = () => {
    onScheduleLater(currentTask.id, new Date(laterDate));
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setLaterDate(format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'));
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Daily Review</h2>
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Skip for today
            </button>
          </div>
          <p className="text-gray-600 text-sm">
            Review your pending tasks and plan your day
          </p>

          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Task {currentIndex + 1} of {tasks.length}
          </p>
        </div>

        {/* Current Task */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentTask.title}
          </h3>
          {currentTask.description && (
            <p className="text-gray-600 text-sm">{currentTask.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleScheduleToday}
            className="w-full btn-primary text-lg py-4"
          >
            Schedule for Today
          </button>

          <div className="flex gap-3">
            <input
              type="date"
              value={laterDate}
              onChange={(e) => setLaterDate(e.target.value)}
              min={format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleScheduleLater}
              className="btn-secondary whitespace-nowrap"
            >
              Schedule Later
            </button>
          </div>

          <button
            onClick={moveToNext}
            className="w-full text-gray-500 hover:text-gray-700 py-2"
          >
            Skip this task
          </button>
        </div>
      </div>
    </div>
  );
};

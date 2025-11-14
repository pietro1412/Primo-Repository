import { useState } from 'react';
import type { Task } from '../types';
import { format, parseISO } from 'date-fns';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export const TaskModal = ({
  task,
  onClose,
  onUpdate,
  onDelete,
  onComplete,
}: TaskModalProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [scheduledDate, setScheduledDate] = useState(task.scheduledDate || '');

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        scheduledDate: scheduledDate || null,
      });
      onClose();
    }
  };

  const handleComplete = () => {
    onComplete(task.id);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const getDuration = () => {
    if (task.status === 'completed' && task.completedAt && task.createdAt) {
      const ms = new Date(task.completedAt).getTime() - new Date(task.createdAt).getTime();
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days}d`;
      if (hours > 0) return `${hours}h`;
      return '< 1h';
    }
    return null;
  };

  const duration = getDuration();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Task description (optional)"
            />
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Date
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Badge */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {task.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
              {duration && (
                <span className="text-xs text-gray-500">
                  Duration: {duration}
                </span>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Created:</span>{' '}
              {format(parseISO(task.createdAt), 'MMM d, yyyy HH:mm')}
            </p>
            {task.status === 'completed' && task.completedAt && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Completed:</span>{' '}
                {format(parseISO(task.completedAt), 'MMM d, yyyy HH:mm')}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          {task.status === 'pending' && (
            <button
              onClick={handleComplete}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Mark as Completed
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 btn-primary"
          >
            Save Changes
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

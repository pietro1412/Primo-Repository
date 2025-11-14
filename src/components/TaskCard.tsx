import type { Task } from '../types';
import { format, parseISO, differenceInHours, differenceInDays } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isDraggable?: boolean;
}

export const TaskCard = ({
  task,
  onComplete,
  onDelete,
  isDraggable = true,
}: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Calculate duration for completed tasks
  const getDuration = () => {
    if (task.status === 'completed' && task.completedAt && task.createdAt) {
      const hours = differenceInHours(
        parseISO(task.completedAt),
        parseISO(task.createdAt)
      );
      const days = differenceInDays(
        parseISO(task.completedAt),
        parseISO(task.createdAt)
      );

      if (days > 0) {
        return `${days}d`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else {
        return '< 1h';
      }
    }
    return null;
  };

  const duration = getDuration();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium text-sm ${
              task.status === 'completed'
                ? 'line-through text-gray-400'
                : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1">{task.description}</p>
          )}

          {/* Date Information */}
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-400">
              Created: {format(parseISO(task.createdAt), 'MMM d, HH:mm')}
            </p>

            {task.status === 'completed' && task.completedAt && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-green-600">
                  Completed: {format(parseISO(task.completedAt), 'MMM d, HH:mm')}
                </p>
                {duration && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    {duration}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          {task.status === 'pending' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete(task.id);
              }}
              className="p-1 hover:bg-green-100 rounded text-green-600 text-xs"
              title="Complete task"
            >
              ✓
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1 hover:bg-red-100 rounded text-red-600 text-xs"
            title="Delete task"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

import type { Task } from '../types';
import { format, parseISO } from 'date-fns';
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
          {task.scheduledDate && (
            <p className="text-xs text-primary-600 mt-1">
              {format(parseISO(task.scheduledDate), 'MMM d, yyyy')}
            </p>
          )}
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

import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import type { Task } from '../types';
import { TaskCard } from './TaskCard';

interface UnscheduledAreaProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const UnscheduledArea = ({
  tasks,
  onComplete,
  onDelete,
}: UnscheduledAreaProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unscheduled',
  });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">
        Unscheduled Tasks ({tasks.length})
      </h3>
      <SortableContext id="unscheduled" items={tasks.map((t) => t.id)}>
        <div
          ref={setNodeRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-lg border-2 border-dashed transition-all ${
            isOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 bg-gray-50'
          }`}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

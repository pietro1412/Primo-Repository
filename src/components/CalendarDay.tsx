import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import type { Task } from '../types';
import { format, isToday } from 'date-fns';
import { TaskCard } from './TaskCard';

interface CalendarDayProps {
  date: Date;
  tasks: Task[];
  dateStr: string;
  isOtherMonth?: boolean;
  viewMode: 'week' | 'month';
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CalendarDay = ({
  date,
  tasks,
  dateStr,
  isOtherMonth = false,
  viewMode,
  onComplete,
  onDelete,
}: CalendarDayProps) => {
  const droppableId = `day-${dateStr}`;

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
  });

  return (
    <SortableContext id={droppableId} items={tasks.map((t) => t.id)}>
      <div
        ref={setNodeRef}
        className={`calendar-day ${isToday(date) ? 'today' : ''} ${
          isOtherMonth ? 'opacity-40' : ''
        } ${viewMode === 'month' ? 'min-h-[100px]' : ''} ${
          isOver ? 'ring-2 ring-primary-500 bg-primary-50' : ''
        } transition-all`}
      >
        <div className="font-semibold text-sm mb-2 text-center">
          {viewMode === 'week' && (
            <div className="text-gray-500">{format(date, 'EEE')}</div>
          )}
          <div
            className={isToday(date) ? 'text-primary-600' : 'text-gray-900'}
          >
            {format(date, 'd')}
          </div>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </SortableContext>
  );
};

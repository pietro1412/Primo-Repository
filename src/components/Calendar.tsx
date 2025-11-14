import { useState } from 'react';
import type { Task } from '../types';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  addWeeks,
  subWeeks,
  isToday,
} from 'date-fns';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';

interface CalendarProps {
  tasks: Task[];
  onScheduleTask: (taskId: string, date: Date | null) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const Calendar = ({
  tasks,
  onScheduleTask,
  onCompleteTask,
  onDeleteTask,
}: CalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.scheduledDate) return false;
      return isSameDay(parseISO(task.scheduledDate), date);
    });
  };

  const unscheduledTasks = tasks.filter(
    (task) => !task.scheduledDate && task.status === 'pending'
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const taskId = active.id as string;
      const overId = over.id as string;

      if (overId === 'unscheduled') {
        onScheduleTask(taskId, null);
      } else if (overId.startsWith('day-')) {
        const dateStr = overId.replace('day-', '');
        const date = parseISO(dateStr);
        onScheduleTask(taskId, date);
      }
    }

    setActiveId(null);
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
            className="btn-secondary"
          >
            ← Previous
          </button>
          <h2 className="text-lg font-semibold">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h2>
          <button
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            className="btn-secondary"
          >
            Next →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {daysInWeek.map((day) => {
            const dayTasks = getTasksForDate(day);
            const dateStr = format(day, 'yyyy-MM-dd');
            const droppableId = `day-${dateStr}`;

            return (
              <SortableContext
                key={dateStr}
                id={droppableId}
                items={dayTasks.map((t) => t.id)}
              >
                <div
                  id={droppableId}
                  className={`calendar-day ${isToday(day) ? 'today' : ''}`}
                >
                  <div className="font-semibold text-sm mb-2 text-center">
                    <div className="text-gray-500">{format(day, 'EEE')}</div>
                    <div
                      className={
                        isToday(day) ? 'text-primary-600' : 'text-gray-900'
                      }
                    >
                      {format(day, 'd')}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dayTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={onCompleteTask}
                        onDelete={onDeleteTask}
                      />
                    ))}
                  </div>
                </div>
              </SortableContext>
            );
          })}
        </div>

        {/* Unscheduled Tasks */}
        {unscheduledTasks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">
              Unscheduled Tasks ({unscheduledTasks.length})
            </h3>
            <SortableContext
              id="unscheduled"
              items={unscheduledTasks.map((t) => t.id)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {unscheduledTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={onCompleteTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        )}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onComplete={() => {}}
            onDelete={() => {}}
            isDraggable={false}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

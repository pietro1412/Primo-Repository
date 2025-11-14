import { useState } from 'react';
import type { Task } from '../types';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
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
import { TaskStats } from './TaskStats';
import { TaskFilters } from './TaskFilters';

interface CalendarProps {
  tasks: Task[];
  onScheduleTask: (taskId: string, date: Date | null) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

type ViewMode = 'week' | 'month';

export const Calendar = ({
  tasks,
  onScheduleTask,
  onCompleteTask,
  onDeleteTask,
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showPending, setShowPending] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Calculate days based on view mode
  const getDaysToShow = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      // Include days from previous/next month to fill the grid
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    }
  };

  const days = getDaysToShow();

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.scheduledDate) return false;
      if (!isSameDay(parseISO(task.scheduledDate), date)) return false;

      // Apply filters
      if (task.status === 'completed' && !showCompleted) return false;
      if (task.status === 'pending' && !showPending) return false;

      return true;
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

  const handlePrevious = () => {
    if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const getHeaderText = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button onClick={handlePrevious} className="btn-secondary">
            ← Previous
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{getHeaderText()}</h2>

            {/* View Toggle */}
            <div className="flex gap-1 bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'week'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'month'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          <button onClick={handleNext} className="btn-secondary">
            Next →
          </button>
        </div>

        {/* Stats and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <TaskStats
            tasks={tasks}
            currentDate={currentDate}
            viewMode={viewMode}
          />
          <TaskFilters
            showCompleted={showCompleted}
            showPending={showPending}
            onToggleCompleted={setShowCompleted}
            onTogglePending={setShowPending}
          />
        </div>

        {/* Day Headers (for month view) */}
        {viewMode === 'month' && (
          <div className="grid grid-cols-7 gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-gray-600">
                {day}
              </div>
            ))}
          </div>
        )}

        {/* Calendar Grid */}
        <div
          className={`grid gap-3 ${
            viewMode === 'week'
              ? 'grid-cols-1 md:grid-cols-7'
              : 'grid-cols-7'
          }`}
        >
          {days.map((day) => {
            const dayTasks = getTasksForDate(day);
            const dateStr = format(day, 'yyyy-MM-dd');
            const droppableId = `day-${dateStr}`;
            const isOtherMonth = viewMode === 'month' && !isCurrentMonth(day);

            return (
              <SortableContext
                key={dateStr}
                id={droppableId}
                items={dayTasks.map((t) => t.id)}
              >
                <div
                  id={droppableId}
                  className={`calendar-day ${isToday(day) ? 'today' : ''} ${
                    isOtherMonth ? 'opacity-40' : ''
                  } ${viewMode === 'month' ? 'min-h-[100px]' : ''}`}
                >
                  <div className="font-semibold text-sm mb-2 text-center">
                    {viewMode === 'week' && (
                      <div className="text-gray-500">{format(day, 'EEE')}</div>
                    )}
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

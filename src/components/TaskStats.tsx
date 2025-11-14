import type { Task } from '../types';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
  differenceInHours,
} from 'date-fns';

interface TaskStatsProps {
  tasks: Task[];
  currentDate: Date;
  viewMode: 'week' | 'month';
}

export const TaskStats = ({ tasks, currentDate, viewMode }: TaskStatsProps) => {
  const getInterval = () => {
    if (viewMode === 'week') {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      };
    } else {
      return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      };
    }
  };

  const interval = getInterval();

  const tasksInPeriod = tasks.filter((task) => {
    if (!task.scheduledDate) return false;
    const scheduledDate = parseISO(task.scheduledDate);
    return isWithinInterval(scheduledDate, interval);
  });

  const completedTasks = tasksInPeriod.filter((t) => t.status === 'completed');
  const pendingTasks = tasksInPeriod.filter((t) => t.status === 'pending');

  // Calculate average completion time
  const tasksWithDuration = completedTasks.filter(
    (t) => t.completedAt && t.createdAt
  );

  const avgDuration =
    tasksWithDuration.length > 0
      ? tasksWithDuration.reduce((sum, task) => {
          const hours = differenceInHours(
            parseISO(task.completedAt!),
            parseISO(task.createdAt)
          );
          return sum + hours;
        }, 0) / tasksWithDuration.length
      : 0;

  const completionRate =
    tasksInPeriod.length > 0
      ? Math.round((completedTasks.length / tasksInPeriod.length) * 100)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {viewMode === 'week' ? 'Weekly' : 'Monthly'} Stats
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {tasksInPeriod.length}
          </div>
          <div className="text-xs text-gray-500">Total Tasks</div>
        </div>

        {/* Completed */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {completedTasks.length}
          </div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>

        {/* Pending */}
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {pendingTasks.length}
          </div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>

        {/* Completion Rate */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {completionRate}%
          </div>
          <div className="text-xs text-gray-500">Completion Rate</div>
        </div>
      </div>

      {/* Average Duration */}
      {avgDuration > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
          <div className="text-sm text-gray-600">
            Avg. completion time:{' '}
            <span className="font-semibold">
              {avgDuration < 24
                ? `${Math.round(avgDuration)}h`
                : `${Math.round(avgDuration / 24)}d`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

import { useTasks } from './hooks/useTasks';
import { Calendar } from './components/Calendar';
import { DailyReview } from './components/DailyReview';
import { AddTask } from './components/AddTask';
import { startOfDay } from 'date-fns';

function App() {
  const {
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
  } = useTasks();

  const reviewTasks = tasks.filter((task) =>
    dailyReview.pendingTasksForReview.includes(task.id)
  );

  const handleScheduleToday = (taskId: string) => {
    scheduleTask(taskId, startOfDay(new Date()));
  };

  const handleScheduleLater = (taskId: string, date: Date) => {
    scheduleTask(taskId, startOfDay(date));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Daily Todo</h1>
          <p className="text-gray-600 text-sm mt-1">
            Plan your day, drag tasks to schedule them
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Add Task */}
          <AddTask onAdd={addTask} />

          {/* Calendar */}
          <Calendar
            tasks={tasks}
            onScheduleTask={scheduleTask}
            onCompleteTask={completeTask}
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
          />
        </div>
      </main>

      {/* Daily Review Modal */}
      {showDailyReview && (
        <DailyReview
          tasks={reviewTasks}
          onScheduleToday={handleScheduleToday}
          onScheduleLater={handleScheduleLater}
          onComplete={completeDailyReview}
          onSkip={skipDailyReview}
        />
      )}
    </div>
  );
}

export default App;

import { useTasks } from './hooks/useTasks';
import { Calendar } from './components/Calendar';
import { DailyReview } from './components/DailyReview';
import { AddTask } from './components/AddTask';
import { Auth } from './components/Auth';
import { startOfDay } from 'date-fns';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    tasks,
    loading: tasksLoading,
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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daily Todo</h1>
            <p className="text-gray-600 text-sm mt-1">
              Plan your day, drag tasks to schedule them
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {tasksLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        ) : (
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
        )}
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

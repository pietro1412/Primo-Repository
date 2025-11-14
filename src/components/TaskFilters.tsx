interface TaskFiltersProps {
  showCompleted: boolean;
  showPending: boolean;
  onToggleCompleted: (show: boolean) => void;
  onTogglePending: (show: boolean) => void;
}

export const TaskFilters = ({
  showCompleted,
  showPending,
  onToggleCompleted,
  onTogglePending,
}: TaskFiltersProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <label className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
        <input
          type="checkbox"
          checked={showPending}
          onChange={(e) => onTogglePending(e.target.checked)}
          className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
        />
        <span className="text-sm font-medium text-gray-700">
          Show Pending
        </span>
      </label>

      <label className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={(e) => onToggleCompleted(e.target.checked)}
          className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
        />
        <span className="text-sm font-medium text-gray-700">
          Show Completed
        </span>
      </label>
    </div>
  );
};

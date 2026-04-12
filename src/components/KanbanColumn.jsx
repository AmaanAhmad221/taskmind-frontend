import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const columnConfig = {
  TODO: {
    label: 'To Do',
    bg: 'bg-gray-50 dark:bg-gray-900/50',
    header: 'bg-gray-100 dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-400 dark:bg-gray-500',
    count: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    ring: 'ring-gray-300',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-blue-50/50 dark:bg-blue-900/10',
    header: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
    count: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
    ring: 'ring-blue-300',
  },
  DONE: {
    label: 'Done',
    bg: 'bg-green-50/50 dark:bg-green-900/10',
    header: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
    count: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    ring: 'ring-green-300',
  },
};

const KanbanColumn = ({ status, tasks, onEdit, onDelete, onShare }) => {
  const config = columnConfig[status];

  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className={`
      flex flex-col rounded-2xl border ${config.border} ${config.bg}
      min-h-[520px] transition-all duration-200
      ${isOver
        ? `ring-2 ${config.ring} scale-[1.01] shadow-lg`
        : 'shadow-sm'
      }
    `}>
      
      <div className={`flex items-center justify-between px-4 py-3.5
                       rounded-t-2xl ${config.header}
                       border-b ${config.border}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.dot}`} />
          <h2 className="font-semibold text-gray-800 dark:text-gray-100
                         text-sm tracking-tight">
            {config.label}
          </h2>
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5
                          rounded-full ${config.count}`}>
          {tasks.length}
        </span>
      </div>

      {/* Drag & Drop + cards */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onShare={onShare}
            />
          ))}
        </SortableContext>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center
                          py-16 select-none">
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800
                            flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-300 dark:text-gray-600"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0
                     002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2
                     2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-600">
              No tasks
            </p>
            <p className="text-xs text-gray-300 dark:text-gray-700 mt-0.5">
              Drop a task here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const priorityConfig = {
  HIGH: {
    label: 'High',
    class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    dot: 'bg-red-500',
  },
  MEDIUM: {
    label: 'Medium',
    class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  LOW: {
    label: 'Low',
    class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dot: 'bg-green-500',
  },
};

const TaskCard = ({ task, onEdit, onDelete, onShare }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'DONE';

  const isDueSoon =
    task.dueDate &&
    !isOverdue &&
    task.status !== 'DONE' &&
    new Date(task.dueDate) - new Date() < 24 * 60 * 60 * 1000;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : transition,
        opacity: isDragging ? 0.35 : 1,
        zIndex: isDragging ? 999 : 1,
        position: 'relative',
        touchAction: 'none',
      }}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border
        border-gray-200 dark:border-gray-700 p-4
        select-none
        ${isDragging
          ? 'shadow-xl ring-2 ring-indigo-400'
          : 'shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing'
        }
      `}
      {...attributes}
      {...listeners}
    >
      {/* Priority + badges */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          <span className={`text-xs font-medium px-2 py-0.5
                            rounded-full ${priority.class}`}>
            {priority.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isDueSoon && (
            <span className="text-xs text-amber-600 dark:text-amber-400
                             font-semibold bg-amber-50 dark:bg-amber-900/20
                             px-2 py-0.5 rounded-full border
                             border-amber-200 dark:border-amber-800">
              Due soon
            </span>
          )}
          {isOverdue && (
            <span className="text-xs text-red-500 dark:text-red-400
                             font-semibold bg-red-50 dark:bg-red-900/20
                             px-2 py-0.5 rounded-full border
                             border-red-200 dark:border-red-800">
              Overdue
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 dark:text-white
                     text-sm mb-1.5 line-clamp-2 leading-snug">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400
                      line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Due date */}
      {task.dueDate && (
        <div className="flex items-center gap-1.5 mb-3">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7
                 a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={`text-xs font-medium ${
            isOverdue
              ? 'text-red-500 dark:text-red-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {formatDate(task.dueDate)}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div
        className="flex items-center gap-1 pt-2.5 border-t
                   border-gray-100 dark:border-gray-700"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          className="flex-1 text-xs py-1.5 text-indigo-600
                     dark:text-indigo-400 hover:bg-indigo-50
                     dark:hover:bg-indigo-900/20 rounded-lg
                     transition-colors font-medium"
        >
          Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onShare(task); }}
          className="flex-1 text-xs py-1.5 text-gray-500
                     dark:text-gray-400 hover:bg-gray-50
                     dark:hover:bg-gray-700/50 rounded-lg
                     transition-colors font-medium"
        >
          Share
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="flex-1 text-xs py-1.5 text-red-500
                     dark:text-red-400 hover:bg-red-50
                     dark:hover:bg-red-900/20 rounded-lg
                     transition-colors font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
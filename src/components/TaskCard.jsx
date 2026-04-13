import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const priorityConfig = {
  HIGH: {
    label: "High",
    class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-500",
  },
  MEDIUM: {
    label: "Medium",
    class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  LOW: {
    label: "Low",
    class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    dot: "bg-green-500",
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
    data: {
      type: "task",
      task,
    },
  });

  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "DONE";

  const isDueSoon =
    task.dueDate &&
    !isOverdue &&
    task.status !== "DONE" &&
    new Date(task.dueDate) - new Date() < 24 * 60 * 60 * 1000;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? "none" : transition,
        opacity: isDragging ? 0.4 : 1,
        position: "relative",
        zIndex: isDragging ? 999 : "auto",
      }}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border
        border-gray-200 dark:border-gray-700 p-4
        hover:shadow-md hover:border-indigo-200
        dark:hover:border-indigo-700 select-none
        ${isDragging
          ? "shadow-2xl ring-2 ring-indigo-400 rotate-1"
          : "shadow-sm"
        }
      `}
      {...attributes}
    >
      {/* ── Drag handle row ───────────────────────────────── */}
      <div
        {...listeners}
        className="flex items-center justify-between mb-2.5 cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
      >
        {/* Priority badge */}
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.class}`}>
            {priority.label}
          </span>
        </div>

        {/* Due-soon / Overdue badges + drag grip */}
        <div className="flex items-center gap-1.5">
          {isDueSoon && !isOverdue && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600
                             dark:text-amber-400 font-semibold bg-amber-50
                             dark:bg-amber-900/20 px-2 py-0.5 rounded-full
                             border border-amber-200 dark:border-amber-800">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58
                  9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z
                  M11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd" />
              </svg>
              Due soon
            </span>
          )}
          {isOverdue && (
            <span className="inline-flex items-center gap-1 text-xs text-red-500
                             dark:text-red-400 font-semibold bg-red-50
                             dark:bg-red-900/20 px-2 py-0.5 rounded-full
                             border border-red-200 dark:border-red-800">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0
                  00-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd" />
              </svg>
              Overdue
            </span>
          )}

          {/* Grip icon — visual cue for dragging */}
          <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0"
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a1 1 0 000 2 1 1 0 000-2zm6 0a1 1 0 000 2 1 1 0 000-2zM7 8a1 1 0
                     000 2 1 1 0 000-2zm6 0a1 1 0 000 2 1 1 0 000-2zm-6 6a1 1 0 000 2 1 1 0
                     000-2zm6 0a1 1 0 000 2 1 1 0 000-2z" />
          </svg>
        </div>
      </div>

      {/* ── Title (also draggable area) ───────────────────── */}
      <div
        {...listeners}
        style={{ touchAction: "none" }}
        className="cursor-grab active:cursor-grabbing"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white
                       text-sm mb-1.5 line-clamp-2 leading-snug">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400
                        line-clamp-2 mb-3 leading-relaxed">
            {task.description}
          </p>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-1.5 mb-3">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7
                       a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`text-xs font-medium ${
              isOverdue ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
            }`}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        )}
      </div>

      {/* ── Action buttons — NO listeners here ───────────── */}
      <div className="flex items-center gap-1 pt-2.5 border-t
                      border-gray-100 dark:border-gray-700">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit(task)}
          className="flex-1 text-xs py-1.5 text-indigo-600
                     dark:text-indigo-400 hover:bg-indigo-50
                     dark:hover:bg-indigo-900/20 rounded-lg
                     transition-colors font-medium"
        >
          Edit
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onShare(task)}
          className="flex-1 text-xs py-1.5 text-gray-500
                     dark:text-gray-400 hover:bg-gray-50
                     dark:hover:bg-gray-700/50 rounded-lg
                     transition-colors font-medium"
        >
          Share
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(task.id)}
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
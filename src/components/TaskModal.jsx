import { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, onSubmit, editTask, loading }) => {
  const [form, setForm] = useState({
    title: '', description: '',
    status: 'TODO', priority: 'MEDIUM', dueDate: '',
  });

  useEffect(() => {
    if (editTask) {
      setForm({
        title:       editTask.title       || '',
        description: editTask.description || '',
        status:      editTask.status      || 'TODO',
        priority:    editTask.priority    || 'MEDIUM',
        dueDate:     editTask.dueDate
                       ? editTask.dueDate.substring(0, 16) : '',
      });
    } else {
      setForm({
        title: '', description: '',
        status: 'TODO', priority: 'MEDIUM', dueDate: '',
      });
    }
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      dueDate: form.dueDate ? form.dueDate + ':00' : null,
    });
  };

  const inputClass = `
    w-full px-3.5 py-2.5 text-sm rounded-xl border
    border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-700/50
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-indigo-500
    focus:border-transparent transition-colors
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center
                    justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full sm:max-w-md bg-white dark:bg-gray-800
                      rounded-t-2xl sm:rounded-2xl shadow-2xl border-t
                      sm:border border-gray-200 dark:border-gray-700
                      max-h-[90vh] overflow-y-auto">

        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600
                          rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4
                        border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              {editTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {editTask
                ? 'Update the task details below'
                : 'Fill in the details for your new task'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600
                       dark:hover:text-gray-200 hover:bg-gray-100
                       dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4
                                                  pb-8 sm:pb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700
                               dark:text-gray-300 mb-1.5 uppercase
                               tracking-wide">
              Title <span className="text-red-500 normal-case">*</span>
            </label>
            <input
              type="text" required
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700
                               dark:text-gray-300 mb-1.5 uppercase
                               tracking-wide">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Add more details..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700
                                 dark:text-gray-300 mb-1.5 uppercase
                                 tracking-wide">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700
                                 dark:text-gray-300 mb-1.5 uppercase
                                 tracking-wide">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value })}
                className={inputClass}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700
                               dark:text-gray-300 mb-1.5 uppercase
                               tracking-wide">
              Due Date
            </label>
            <input
              type="datetime-local"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button" onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold
                         text-gray-700 dark:text-gray-300
                         bg-gray-100 dark:bg-gray-700
                         hover:bg-gray-200 dark:hover:bg-gray-600
                         rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 px-4 py-3 text-sm font-semibold
                         text-white bg-indigo-600 hover:bg-indigo-700
                         rounded-xl transition-colors disabled:opacity-60
                         flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white
                                border-t-transparent rounded-full
                                animate-spin" />
              )}
              {editTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
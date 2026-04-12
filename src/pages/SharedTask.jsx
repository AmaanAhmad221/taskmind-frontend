import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ThemeToggle from '../components/ThemeToggle';

const statusConfig = {
  TODO:        { label: 'To Do',       class: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  IN_PROGRESS: { label: 'In Progress', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  DONE:        { label: 'Done',        class: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
};

const priorityConfig = {
  HIGH:   { label: 'High Priority',   class: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  MEDIUM: { label: 'Medium Priority', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  LOW:    { label: 'Low Priority',    class: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
};

const SharedTask = () => {
  const { shortCode }         = useParams();
  const [task, setTask]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/api/s/${shortCode}`);
        setTask(res.data.data);
      } catch {
        setError('This task link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gray-50 dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-indigo-500
                        border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center
                      justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-5xl mb-4">🔗</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Link not found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6
                      text-center max-w-xs">
          {error}
        </p>
        <Link to="/login"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl
                     font-semibold text-sm hover:bg-indigo-700
                     transition-colors shadow-md shadow-indigo-200
                     dark:shadow-none">
          Go to TaskMind
        </Link>
      </div>
    );
  }

  const status   = statusConfig[task.status]     || statusConfig.TODO;
  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50
                    via-blue-50 to-indigo-50 dark:from-gray-950
                    dark:via-gray-900 dark:to-gray-900
                    flex items-center justify-center p-4">

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12
                          bg-indigo-600 rounded-xl shadow-lg
                          shadow-indigo-200 dark:shadow-none mb-3">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500
                        font-medium tracking-wide uppercase">
            Shared via TaskMind
          </p>
        </div>

        {/* Task card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl
                        shadow-gray-200/50 dark:shadow-none
                        border border-gray-200 dark:border-gray-700 p-6">

          {/* Read-only badge */}
          <div className="flex justify-end mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs px-3
                             py-1 bg-gray-100 dark:bg-gray-700/50
                             text-gray-500 dark:text-gray-400
                             rounded-full font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0
                     8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542
                     7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Read-only
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900 dark:text-white
                         mb-3 leading-snug">
            {task.title}
          </h1>

          {/* Description */}
          {task.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4
                          leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Status + Priority badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`text-xs font-semibold px-3 py-1
                              rounded-full ${status.class}`}>
              {status.label}
            </span>
            <span className={`text-xs font-semibold px-3 py-1
                              rounded-full ${priority.class}`}>
              {priority.label}
            </span>
          </div>

          {/* Meta info */}
          <div className="space-y-2.5 pt-4 border-t
                          border-gray-100 dark:border-gray-700">
            {task.dueDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400
                                 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0
                         002-2V7a2 2 0 00-2-2H5a2 2 0 00-2
                         2v12a2 2 0 002 2z" />
                  </svg>
                  Due date
                </span>
                <span className="font-semibold text-gray-900
                                 dark:text-white">
                  {new Date(task.dueDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400
                               flex items-center gap-2">
                <svg className="w-4 h-4" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Created
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {new Date(task.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600
                      mt-5">
          Want to manage your own tasks?{' '}
          <Link to="/register"
            className="text-indigo-500 hover:underline font-semibold">
            Join TaskMind free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SharedTask;
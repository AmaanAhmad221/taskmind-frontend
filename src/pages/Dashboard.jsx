import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,       
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import api from '../api/axios';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

const Dashboard = () => {
  const { user } = useAuth();

  const [tasks, setTasks]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTask, setEditTask]       = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [activeTask, setActiveTask]   = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus]     = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [shareModal, setShareModal]   = useState(null);
  const [copied, setCopied]           = useState(false);
  const [activeColumn, setActiveColumn] = useState('TODO'); 

  
  const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },
  })
);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('size', '100');
      params.append('sortBy', 'createdAt');
      params.append('direction', 'DESC');
      if (search)         params.append('search',   search);
      if (filterStatus)   params.append('status',   filterStatus);
      if (filterPriority) params.append('priority', filterPriority);

      const res = await api.get(`/api/tasks?${params}`);
      setTasks(res.data.data.content);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterPriority]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const getTasksByStatus = (status) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t.id === active.id) || null);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const dragged = tasks.find((t) => t.id === active.id);
    if (!dragged) return;

    let newStatus = over.id;
    if (!STATUSES.includes(newStatus)) {
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) newStatus = overTask.status;
    }
    if (!newStatus || newStatus === dragged.status) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === dragged.id ? { ...t, status: newStatus } : t
      )
    );

    try {
      await api.patch(
        `/api/tasks/${dragged.id}/status?status=${newStatus}`
      );
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === dragged.id ? { ...t, status: dragged.status } : t
        )
      );
    }
  };

  const handleCreate = () => { setEditTask(null); setModalOpen(true); };
  const handleEdit   = (task) => { setEditTask(task); setModalOpen(true); };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editTask) {
        const res = await api.put(`/api/tasks/${editTask.id}`, formData);
        setTasks((prev) =>
          prev.map((t) => (t.id === editTask.id ? res.data.data : t))
        );
      } else {
        const res = await api.post('/api/tasks', formData);
        setTasks((prev) => [res.data.data, ...prev]);
      }
      setModalOpen(false);
      setEditTask(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await api.delete(`/api/tasks/${taskId}`);
    } catch {
      fetchTasks();
    }
  };

  const handleShare = (task) => { setCopied(false); setShareModal(task); };

  const copyLink = () => {
    if (shareModal?.shortUrl) {
      navigator.clipboard.writeText(shareModal.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalTasks  = tasks.length;
  const doneTasks   = getTasksByStatus('DONE').length;
  const progressPct = totalTasks
    ? Math.round((doneTasks / totalTasks) * 100) : 0;

  
  const columnTabs = [
    { key: 'TODO',        label: 'To Do',       count: getTasksByStatus('TODO').length },
    { key: 'IN_PROGRESS', label: 'In Progress',  count: getTasksByStatus('IN_PROGRESS').length },
    { key: 'DONE',        label: 'Done',         count: getTasksByStatus('DONE').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">

        
        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900
                           dark:text-white tracking-tight truncate">
              My Tasks
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs
                          sm:text-sm mt-0.5 hidden sm:block">
              Hey {user?.name?.split(' ')[0]} 👋 — you have{' '}
              <span className="font-semibold text-indigo-600
                               dark:text-indigo-400">
                {getTasksByStatus('TODO').length +
                 getTasksByStatus('IN_PROGRESS').length}
              </span>{' '}
              tasks remaining
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4
                       sm:py-2.5 bg-indigo-600 hover:bg-indigo-700
                       text-white font-semibold text-xs sm:text-sm
                       rounded-xl shadow-md shadow-indigo-200
                       dark:shadow-none transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Task</span>
          </button>
        </div>

        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4
                        sm:mb-6">
          {[
            { label: 'Total',       value: totalTasks,
              color: 'text-gray-900 dark:text-white' },
            { label: 'To Do',       value: getTasksByStatus('TODO').length,
              color: 'text-gray-600 dark:text-gray-400' },
            { label: 'In Progress', value: getTasksByStatus('IN_PROGRESS').length,
              color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Done',        value: doneTasks,
              color: 'text-green-600 dark:text-green-400' },
          ].map((s) => (
            <div key={s.label}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4
                         border border-gray-200 dark:border-gray-700
                         shadow-sm text-center">
              <p className={`text-xl sm:text-2xl font-bold ${s.color}`}>
                {s.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400
                            mt-0.5 font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        
        {totalTasks > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4
                          border border-gray-200 dark:border-gray-700
                          shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold
                               text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span className="text-xs sm:text-sm font-bold
                               text-indigo-600 dark:text-indigo-400">
                {progressPct}%
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700
                            rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full
                           transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4
                        sm:mb-6">
          
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                            text-gray-400 pointer-events-none"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border
                         border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800
                         text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2
                         focus:ring-indigo-500 focus:border-transparent
                         shadow-sm"
            />
          </div>

          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm rounded-xl border
                         border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800
                         text-gray-700 dark:text-gray-300
                         focus:outline-none focus:ring-2
                         focus:ring-indigo-500 shadow-sm"
            >
              <option value="">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm rounded-xl border
                         border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800
                         text-gray-700 dark:text-gray-300
                         focus:outline-none focus:ring-2
                         focus:ring-indigo-500 shadow-sm"
            >
              <option value="">All Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            
            {(searchInput || filterStatus || filterPriority) && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setSearch('');
                  setFilterStatus('');
                  setFilterPriority('');
                }}
                className="px-3 py-2.5 text-sm font-medium
                           text-gray-600 dark:text-gray-400
                           border border-gray-300 dark:border-gray-600
                           rounded-xl hover:bg-gray-50
                           dark:hover:bg-gray-800 transition-colors
                           shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        
        <div className="flex md:hidden gap-1 mb-4 bg-gray-100
                        dark:bg-gray-800 rounded-xl p-1">
          {columnTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveColumn(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5
                          py-2 px-2 rounded-lg text-xs font-semibold
                          transition-all duration-200 ${
                activeColumn === tab.key
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full
                                font-bold ${
                activeColumn === tab.key
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        
        {loading ? (
          <Loader fullScreen={false} />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            
            <div className="hidden md:grid md:grid-cols-3 gap-5">
              {STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={getTasksByStatus(status)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onShare={handleShare}
                />
              ))}
            </div>

            
            {/* Mobile horizontal scroll columns */}
<div className="flex md:hidden gap-3 overflow-x-auto pb-2">
  {STATUSES.map((status) => (
    <div key={status} className="min-w-[85%] flex-shrink-0">
      <KanbanColumn
        status={status}
        tasks={getTasksByStatus(status)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onShare={handleShare}
      />
    </div>
  ))}
</div>

            
            <DragOverlay dropAnimation={null}>
              {activeTask && (
                <div className="bg-white dark:bg-gray-800 rounded-xl
                                shadow-2xl border-2 border-indigo-400
                                p-4 cursor-grabbing rotate-2 opacity-95
                                max-w-xs">
                  <p className="font-semibold text-gray-900 dark:text-white
                                text-sm line-clamp-2">
                    {activeTask.title}
                  </p>
                  {activeTask.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {activeTask.description}
                    </p>
                  )}
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
        onSubmit={handleSubmit}
        editTask={editTask}
        loading={submitting}
      />

      
      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center
                        justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:max-w-sm bg-white dark:bg-gray-800
                          rounded-t-2xl sm:rounded-2xl shadow-2xl border-t
                          sm:border border-gray-200 dark:border-gray-700
                          p-6 pb-8 sm:pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30
                              rounded-xl flex items-center justify-center
                              flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482
                       -.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0
                       2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3
                       0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3
                       3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Share Task
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Anyone with this link can view
                </p>
              </div>
            </div>

            <p className="text-xs font-medium text-gray-600 dark:text-gray-300
                          bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2
                          mb-4 line-clamp-1">
              {shareModal.title}
            </p>

            <div className="flex gap-2">
              <input
                readOnly
                value={shareModal.shortUrl || 'No short link available'}
                className="flex-1 px-3 py-2 text-xs rounded-xl border
                           border-gray-300 dark:border-gray-600
                           bg-gray-50 dark:bg-gray-700
                           text-gray-600 dark:text-gray-300
                           focus:outline-none min-w-0"
              />
              <button
                onClick={copyLink}
                className={`px-4 py-2 text-xs font-semibold rounded-xl
                            transition-colors flex-shrink-0 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <button
              onClick={() => setShareModal(null)}
              className="w-full mt-4 py-3 text-sm font-medium
                         text-gray-500 dark:text-gray-400
                         hover:bg-gray-100 dark:hover:bg-gray-700
                         rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
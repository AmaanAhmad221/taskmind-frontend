import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [editing, setEditing]   = useState(false);
  const [form, setForm] = useState({ name: '', username: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/profile');
        setProfile(res.data.data);
        setForm({
          name:     res.data.data.name,
          username: res.data.data.username,
        });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/api/profile', form);
      // Update auth context with new token and user info
      login(res.data.data);
      setProfile((prev) => ({
        ...prev,
        name:     res.data.data.name,
        username: res.data.data.username,
      }));
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `
    w-full px-4 py-3 text-sm rounded-xl border
    border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-700
    text-gray-900 dark:text-white
    placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-indigo-500
    focus:border-transparent transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950
                      flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500
                        border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completionPct = profile?.totalTasks
    ? Math.round((profile.completedTasks / profile.totalTasks) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-500
                     dark:text-gray-400 hover:text-gray-700
                     dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Profile header card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border
                        border-gray-200 dark:border-gray-700 shadow-sm
                        p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50
                            rounded-2xl flex items-center justify-center
                            flex-shrink-0">
              <span className="text-indigo-600 dark:text-indigo-400
                               font-bold text-2xl">
                {profile?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900
                             dark:text-white">
                {profile?.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{profile?.username}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {profile?.email}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Tasks',  value: profile?.totalTasks },
              { label: 'Completed',    value: profile?.completedTasks },
              { label: 'Completion',   value: `${completionPct}%` },
            ].map((s) => (
              <div key={s.label}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl
                           p-3 text-center">
                <p className="text-xl font-bold text-gray-900
                              dark:text-white">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400
                              mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500
                            dark:text-gray-400 mb-1.5">
              <span>Task completion rate</span>
              <span className="font-semibold text-indigo-600
                               dark:text-indigo-400">
                {completionPct}%
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700
                            rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full
                           transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Edit profile card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border
                        border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm
                           font-medium text-indigo-600 dark:text-indigo-400
                           hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                           rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2
                       2 0 002-2v-5m-1.414-9.414a2 2 0 112.828
                       2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700
                                 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                disabled={!editing}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700
                                 dark:text-gray-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                disabled={!editing}
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700
                                 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                disabled
                value={profile?.email}
                className={inputClass}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {editing && (
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      name:     profile.name,
                      username: profile.username,
                    });
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold
                             text-gray-700 dark:text-gray-300
                             bg-gray-100 dark:bg-gray-700
                             hover:bg-gray-200 dark:hover:bg-gray-600
                             rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold
                             text-white bg-indigo-600 hover:bg-indigo-700
                             rounded-xl transition-colors
                             disabled:opacity-60 flex items-center
                             justify-center gap-2"
                >
                  {saving && (
                    <div className="w-4 h-4 border-2 border-white
                                    border-t-transparent rounded-full
                                    animate-spin" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Member since */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600
                      mt-4">
          Member since{' '}
          {profile?.createdAt
            ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })
            : '—'}
        </p>
      </div>
    </div>
  );
};

export default Profile;
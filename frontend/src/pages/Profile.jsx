import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Bell, Save } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user, token, login, logout } = useAuth();
    const navigate = useNavigate();

    const [emailEnabled, setEmailEnabled] = useState(user?.emailAlerts?.enabled ?? true);
    const [emailTime, setEmailTime] = useState(user?.emailAlerts?.time || '08:00');
    const [saving, setSaving] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };

    const savePreferences = async () => {
        setSaving(true);
        try {
            const res = await authAPI.updateProfile({
                emailAlerts: { enabled: emailEnabled, time: emailTime }
            });
            login(res.data.user, token);
            toast.success('Preferences saved successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save preferences');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-main)]">Profile</h2>
            <div className="card">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/20">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-main)]">{user?.name}</h3>
                        <p className="text-[var(--text-muted)] text-sm">CrediFlow User</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[var(--nav-hover)] border border-[var(--border-color)] rounded-xl">
                        <User size={16} className="text-[var(--text-muted)]" />
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Full Name</p>
                            <p className="text-sm font-medium text-[var(--text-main)]">{user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[var(--nav-hover)] border border-[var(--border-color)] rounded-xl">
                        <Mail size={16} className="text-[var(--text-muted)]" />
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Email</p>
                            <p className="text-sm font-medium text-[var(--text-main)]">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[var(--nav-hover)] border border-[var(--border-color)] rounded-xl">
                        <Calendar size={16} className="text-[var(--text-muted)]" />
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Account ID</p>
                            <p className="text-sm font-medium text-[var(--text-main)] font-mono text-xs">{user?.id}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card space-y-4">
                <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                    <Bell size={18} /> Notification Preferences
                </h3>

                <div className="flex items-center justify-between p-3 bg-[var(--nav-hover)] border border-[var(--border-color)] rounded-xl">
                    <div>
                        <p className="text-sm font-medium text-[var(--text-main)]">Daily Email Digests</p>
                        <p className="text-xs text-[var(--text-muted)]">Receive daily loan updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {emailEnabled && (
                    <div className="flex flex-col gap-2 p-3 bg-[var(--nav-hover)] border border-[var(--border-color)] rounded-xl animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm font-medium text-[var(--text-main)]">Preferred Delivery Time</label>
                        <select
                            className="input-field"
                            value={emailTime}
                            onChange={(e) => setEmailTime(e.target.value)}
                        >
                            <option value="08:00">08:00 AM (Morning)</option>
                            <option value="12:00">12:00 PM (Noon)</option>
                            <option value="18:00">06:00 PM (Evening)</option>
                        </select>
                    </div>
                )}

                <button onClick={savePreferences} disabled={saving} className="btn-primary w-full flex justify-center items-center gap-2">
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Preferences'}
                </button>
            </div>

            <div className="card">
                <button onClick={handleLogout} className="btn-danger w-full flex items-center justify-center gap-2">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );
}

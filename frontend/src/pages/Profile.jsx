import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Bell, Save, Trash2 } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import TimeKeeper from 'react-timekeeper';

export default function Profile() {
    const { user, token, login, logout } = useAuth();
    const navigate = useNavigate();

    const [emailEnabled, setEmailEnabled] = useState(user?.emailAlerts?.enabled ?? true);
    const [emailTime, setEmailTime] = useState(user?.emailAlerts?.time || '08:00');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [currency, setCurrency] = useState(user?.preferences?.currency || 'INR');
    const [saving, setSaving] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetting, setResetting] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };

    const savePreferences = async () => {
        setSaving(true);
        try {
            const res = await authAPI.updateProfile({
                emailAlerts: { enabled: emailEnabled, time: emailTime },
                preferences: { ...user?.preferences, currency }
            });
            login(res.data.user, token);
            toast.success('Preferences saved successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save preferences');
        } finally {
            setSaving(false);
        }
    };

    const handleResetData = async () => {
        setResetting(true);
        try {
            await authAPI.resetData();
            toast.success('All account data has been completely wiped.');
            // Reload window to clear states instantly
            window.location.href = '/dashboard';
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to wipe data');
        } finally {
            setResetting(false);
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
                    <div className="flex flex-col gap-2 p-3 bg-[var(--nav-hover)] border border-[var(--border-color)] rounded-xl animate-in fade-in slide-in-from-top-2 relative">
                        <label className="text-sm font-medium text-[var(--text-main)]">Preferred Delivery Time</label>
                        <div
                            className="input flex items-center justify-between cursor-pointer"
                            onClick={() => setShowTimePicker(true)}
                        >
                            <span className="text-[var(--text-main)] font-medium">
                                {(() => {
                                    const time = emailTime || '08:00';
                                    const [h, m] = time.split(':');
                                    const hour = parseInt(h, 10);
                                    const ampm = hour >= 12 ? 'PM' : 'AM';
                                    const displayHour = hour % 12 || 12;
                                    return `${displayHour.toString().padStart(2, '0')}:${m || '00'} ${ampm}`;
                                })()}
                            </span>
                        </div>

                        {showTimePicker && (
                            <>
                                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowTimePicker(false)} />
                                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl rounded-2xl overflow-hidden scale-90 sm:scale-100 dark:brightness-90">
                                    <TimeKeeper
                                        time={emailTime || '08:00'}
                                        onChange={(newTime) => setEmailTime(newTime.formatted24)}
                                        onDoneClick={() => setShowTimePicker(false)}
                                        switchToMinuteOnHourSelect
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="pt-2 border-t border-[var(--border-color)]">
                    <label className="text-sm font-medium text-[var(--text-main)] mb-2 block">Application Currency</label>
                    <select
                        className="input"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                        <option value="AUD">Australian Dollar (A$)</option>
                        <option value="CAD">Canadian Dollar (C$)</option>
                    </select>
                </div>

                <button onClick={savePreferences} disabled={saving} className="btn-primary w-full flex justify-center items-center gap-2">
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Preferences'}
                </button>
            </div>

            <div className="card border-red-500/30 bg-red-500/5">
                <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-2">
                    <Trash2 size={18} /> Danger Zone
                </h3>
                <p className="text-xs text-[var(--text-muted)] mb-4">
                    Permanently delete all your customers, loans, payments, and tracked notifications. This action cannot be undone.
                </p>
                <button onClick={() => setShowResetModal(true)} disabled={resetting} className="btn-danger w-full flex justify-center items-center gap-2">
                    {resetting ? 'Wiping Data...' : 'Wipe All Data'}
                </button>
            </div>

            <div className="card">
                <button onClick={handleLogout} className="btn-secondary w-full flex items-center justify-center gap-2">
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <ConfirmModal
                isOpen={showResetModal}
                title="Wipe Account Data"
                message="Are you absolutely sure? This will completely and permanently delete all specific Customers, Loans, Payments, and Notifications connected to your account. This action cannot be undone."
                onConfirm={handleResetData}
                onCancel={() => setShowResetModal(false)}
                confirmText="Delete Everything"
                requireInput="RESET"
            />
        </div>
    );
}

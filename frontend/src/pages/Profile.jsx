import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut } from 'lucide-react';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

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
                <button onClick={handleLogout} className="btn-danger w-full mt-6 flex items-center justify-center gap-2">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );
}

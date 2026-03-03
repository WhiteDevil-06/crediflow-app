import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Bell, Menu, Sun, Moon, CheckCircle } from 'lucide-react';
import { notificationAPI } from '../services/api';

const routeTitles = {
    '/dashboard': 'Dashboard',
    '/customers': 'Customers',
    '/loans': 'Loans',
    '/payments': 'Payments',
    '/calculator': 'Calculator',
    '/profile': 'Profile',
};

export default function Navbar({ onToggleSidebar }) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Notification State
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load Notifications
    useEffect(() => {
        if (user) {
            notificationAPI.getAll().then(res => setNotifications(res.data.data)).catch(console.error);
        }
    }, [user, location.pathname]); // Refresh on route change

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationAPI.markRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) { console.error('Failed to mark read', error); }
    };

    // If user is not yet loaded, return empty or safe state
    if (!user && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/calculator') {
        return <header className="bg-[var(--bg-navbar)] h-16 border-b border-[var(--border-color)]"></header>;
    }

    const title = Object.entries(routeTitles).find(([path]) =>
        location.pathname.startsWith(path)
    )?.[1] || 'CrediFlow';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-[var(--bg-navbar)] border-b border-[var(--border-color)] px-4 md:px-6 py-4 flex items-center justify-between transition-colors duration-200">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 -ml-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--nav-hover)] lg:hidden transition-all shrink-0"
                >
                    <Menu size={20} />
                </button>
                <div className="min-w-0">
                    <h1 className="text-lg font-semibold text-[var(--text-main)] truncate">{title}</h1>
                    <p className="hidden md:block text-xs text-[var(--text-muted)] truncate">Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-[var(--nav-hover)] hover:brightness-95 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all shrink-0"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-xl bg-[var(--nav-hover)] hover:brightness-95 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all shrink-0"
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white dark:border-gray-900"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2">
                            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--nav-hover)]">
                                <h3 className="font-semibold text-[var(--text-main)]">Notifications</h3>
                                {unreadCount > 0 && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadCount} new</span>}
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-[var(--text-muted)]">You're all caught up!</div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n._id} className={`p-4 border-b border-[var(--border-color)] last:border-b-0 hover:bg-[var(--nav-hover)] transition-colors cursor-pointer ${!n.read ? 'bg-blue-500/5 dark:bg-blue-500/10' : ''}`} onClick={() => navigate('/dashboard')}>
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <h4 className={`text-sm ${!n.read ? 'font-bold text-[var(--text-main)]' : 'font-medium text-[var(--text-muted)]'}`}>{n.title}</h4>
                                                {!n.read && (
                                                    <button onClick={(e) => handleMarkAsRead(n._id, e)} className="text-blue-500 p-1 hover:bg-blue-500/20 rounded-lg transition-colors" title="Mark as read">
                                                        <CheckCircle size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            <p className={`text-xs ${!n.read ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>{n.message}</p>
                                            <p className="text-[10px] text-[var(--text-muted)] mt-2">{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:text-red-500 bg-[var(--nav-hover)] hover:bg-red-500/10 rounded-xl transition-all duration-200 shrink-0"
                >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
}

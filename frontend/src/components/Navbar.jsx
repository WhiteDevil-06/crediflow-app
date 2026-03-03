import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Bell, Menu, Sun, Moon } from 'lucide-react';

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
                <button className="p-2 rounded-xl bg-[var(--nav-hover)] hover:brightness-95 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all shrink-0">
                    <Bell size={18} />
                </button>
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

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
        return <header className="bg-white dark:bg-gray-900 h-16 border-b border-gray-200 dark:border-gray-800"></header>;
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
                    className="p-2 -ml-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden transition-all"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
                    <p className="hidden md:block text-xs text-gray-500">Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
                    <Bell size={18} />
                </button>
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200"
                >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
}

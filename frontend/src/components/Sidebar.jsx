import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Users, TrendingUp, CreditCard,
    Calculator, User, ChevronRight, Zap, X
} from 'lucide-react';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/customers', icon: Users, label: 'Customers' },
    { to: '/loans', icon: TrendingUp, label: 'Loans' },
    { to: '/payments', icon: CreditCard, label: 'Payments' },
    { to: '/calculator', icon: Calculator, label: 'Calculator' },
    { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-[var(--text-main)] tracking-tight">CrediFlow</span>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => onClose()}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-[var(--text-muted)] hover:bg-[var(--nav-hover)] hover:text-[var(--text-main)] border border-transparent'}`
                            }
                        >
                            <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
                            <span className="flex-1">{label}</span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" size={14} />
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-4 py-4 border-t border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-muted)] text-center">CrediFlow v1.0 · Interest Manager</p>
                </div>
            </aside>
        </>
    );
}

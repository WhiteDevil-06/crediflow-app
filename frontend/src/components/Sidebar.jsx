import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Users, TrendingUp, CreditCard,
    Calculator, User, ChevronRight, Zap, X, PanelLeftClose, PanelLeftOpen
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
    // Preserve the collapsed state mechanically across page reloads
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem('sidebarCollapsed') === 'true';
    });

    const toggleCollapse = () => {
        setIsCollapsed(prev => {
            const newState = !prev;
            localStorage.setItem('sidebarCollapsed', newState);
            return newState;
        });
    };

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
                fixed inset-y-0 left-0 z-50 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col transition-all duration-300 ease-in-out lg:static lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isCollapsed ? 'w-64 lg:w-20' : 'w-64'}
            `}>
                {/* Logo */}
                <div className={`flex items-center justify-between py-5 border-b border-[var(--border-color)] transition-all duration-300 h-[76px] ${isCollapsed ? 'lg:justify-center px-6 lg:px-0' : 'px-6'}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-500/50">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className={`text-xl font-bold text-[var(--text-main)] tracking-tight whitespace-nowrap transition-all duration-300 flex-shrink-0 ${isCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100 w-auto'}`}>CrediFlow</span>
                    </div>
                    <button onClick={onClose} className={`lg:hidden p-2 text-gray-400 hover:text-[var(--text-main)] transition-colors`}>
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => onClose()}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isCollapsed ? 'lg:justify-center' : ''}
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-[var(--text-muted)] hover:bg-[var(--nav-hover)] hover:text-[var(--text-main)] border border-transparent'}`
                            }
                            title={isCollapsed ? label : undefined}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" size={20} />
                            <span className={`whitespace-nowrap transition-all duration-300 flex-1 ${isCollapsed ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100 block'}`}>{label}</span>
                            {!isCollapsed && <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity lg:block hidden" />}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Toggle */}
                <div className="p-4 border-t border-[var(--border-color)] flex justify-center">
                    <button
                        onClick={toggleCollapse}
                        className={`hidden lg:flex items-center justify-center w-full p-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--nav-hover)] transition-all ${isCollapsed ? '' : 'gap-3'}`}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <PanelLeftOpen size={22} className="text-gray-400 hover:text-blue-500 transition-colors" /> : <><PanelLeftClose size={20} className="text-gray-400 group-hover:text-blue-500" /> <span className="font-semibold text-sm flex-1 text-left">Collapse</span></>}
                    </button>
                </div>
            </aside>
        </>
    );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Settings } from 'lucide-react';

const AdminSidebar = () => {
    const navItems = [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { path: '/careervault/admin', icon: <Briefcase size={20} />, label: 'Pending Resources' },
        // These routes can be added later:
        // { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        // { path: '/admin/jobs', icon: <Briefcase size={20} />, label: 'Jobs' },
        // { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <aside className="w-64 bg-surface-900 text-surface-50 flex flex-col h-full shrink-0 hidden md:flex">
            {/* Branding Sidebar Header */}
            <div className="h-16 flex items-center px-6 border-b border-surface-800">
                <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                    InterHub Admin
                </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4 px-3 mt-4">
                    Main Menu
                </div>

                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200
                            ${isActive
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-900/20'
                                : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                            }
                        `}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Sidebar Footer (Optional) */}
            <div className="p-4 border-t border-surface-800 text-xs text-surface-500 text-center">
                &copy; {new Date().getFullYear()} AntiGravity
            </div>
        </aside>
    );
};

export default AdminSidebar;

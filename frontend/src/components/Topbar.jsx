import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Search, ChevronDown, User, LogOut, FileText, Target, MessageCircle, BookOpen, Library, Palette, Monitor, Moon, Sparkles, LayoutDashboard, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const getSidebarNav = (role) => {
    if (role === 'recruiter') {
        return [
            { label: 'Dashboard', href: '/recruiter/dashboard', icon: <LayoutDashboard size={18} /> },
            { label: 'Post Job', href: '/recruiter/dashboard', icon: <PlusCircle size={18} /> },
            { label: 'Find Candidates', href: '/search', icon: <Search size={18} /> },
        ];
    }
    return [
        { label: 'Dashboard', href: '/seeker-dashboard', icon: <LayoutDashboard size={18} /> },
        { label: 'Find Jobs', href: '/search', icon: <Search size={18} /> },
        { label: 'ATS Report', href: '/ats-score', icon: <FileText size={18} /> },
        { label: 'Skill Gap', href: '/skill-gap', icon: <Target size={18} /> },
        // { label: 'Job Matcher', href: '/job-recommender', icon: <Sparkles size={18} /> },
        { label: 'AI Coach', href: '/chat', icon: <MessageCircle size={18} /> },
        { label: 'Vault', href: '/careervault', icon: <Library size={18} /> },
    ];
};

const Topbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [featuresOpen, setFeaturesOpen] = useState(false);
    const [themeOpen, setThemeOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') || 'student';
    const dynamicNav = getSidebarNav(role);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0 relative z-20">
            {/* Left Box: Logo */}
            <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2 shrink-0 group">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
                        <Briefcase size={16} />
                    </div>
                    <span className="font-bold text-slate-900 text-base">
                        Intern<span className="text-blue-600">Hub</span>
                        <span className="ml-1 text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 rounded px-1.5 py-0.5 align-middle">AI</span>
                    </span>
                </Link>
            </div>

            {/* Right Box: Search, Themes, Features, Login/Profile */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Theme Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setThemeOpen(!themeOpen)}
                        className="flex items-center gap-1.5 px-2 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                        title="Change Theme"
                    >
                        <Palette size={18} />
                    </button>
                    <AnimatePresence>
                        {themeOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 overflow-hidden"
                                onMouseLeave={() => setThemeOpen(false)}
                            >
                                <button
                                    onClick={() => { setTheme('default'); setThemeOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors group ${theme === 'default' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'}`}
                                >
                                    <Monitor size={16} className={theme === 'default' ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'} /> Default
                                </button>
                                <button
                                    onClick={() => { setTheme('dark'); setThemeOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors group ${theme === 'dark' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'}`}
                                >
                                    <Moon size={16} className={theme === 'dark' ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'} /> Dark Theme
                                </button>
                                <button
                                    onClick={() => { setTheme('gradient'); setThemeOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors group ${theme === 'gradient' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'}`}
                                >
                                    <Sparkles size={16} className={theme === 'gradient' ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'} /> Gradient & Animated
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Features Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setFeaturesOpen(!featuresOpen)}
                        className="flex items-center gap-1.5 px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <span>Features</span>
                        <ChevronDown size={16} className={`text-slate-500 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {featuresOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-12 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 overflow-hidden"
                                onMouseLeave={() => setFeaturesOpen(false)}
                            >
                                {dynamicNav.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={() => setFeaturesOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors group"
                                    >
                                        <span className="text-slate-500 group-hover:text-blue-600">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Internship Search */}
                <Link 
                    to="/search"
                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                    title="Find Internships"
                >
                    <Search size={18} />
                    <span className="hidden sm:inline">Find Internships</span>
                </Link>

                <div className="h-5 w-[1px] bg-slate-200 mx-1"></div>

                {/* Profile / Login */}
                {token ? (
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100 transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                                U
                            </div>
                            <ChevronDown size={16} className={`text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 overflow-hidden"
                                    onMouseLeave={() => setDropdownOpen(false)}
                                >
                                    <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2 text-base text-slate-700 hover:bg-slate-50" onClick={() => setDropdownOpen(false)}>
                                        <User size={16} /> My Profile
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-base text-red-600 hover:bg-red-50">
                                        <LogOut size={16} /> Log Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="text-base font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
                            Log in
                        </Link>
                        <Link to="/login" className="bg-slate-900 text-white text-base font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-all shadow-sm">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Topbar;

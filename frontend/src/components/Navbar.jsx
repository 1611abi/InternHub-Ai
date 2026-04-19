import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Search, Bell, MessageSquare, 
    User, Bookmark, Settings, LogOut 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="h-16 w-full bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-50">
            {/* Left Section */}
            <Link to="/" className="flex items-center gap-3 shrink-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 p-1 -ml-1 transition-all">
                {/* Simple Logo Square Icon */}
                <div className="w-8 h-8 bg-slate-900 rounded-[8px] flex items-center justify-center shadow-sm">
                    <div className="w-3 h-3 bg-white rounded-[2px]"></div>
                </div>
                {/* Bold Product Name */}
                <span className="font-bold text-slate-900 text-[17px] tracking-tight ml-1">
                    InternHub AI
                </span>
            </Link>

            {/* Center Section */}
            <div className="hidden md:flex flex-1 max-w-md mx-6 group">
                <div className="relative flex items-center w-full">
                    <Search 
                        className="absolute left-3 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" 
                        size={20} 
                    />
                    <input 
                        type="text" 
                        placeholder="Search internships, resources, skills..." 
                        className="w-full h-10 pl-10 pr-4 bg-slate-100/80 hover:bg-slate-200/60 focus:bg-white border border-transparent focus:border-blue-200 focus:ring-[3px] focus:ring-blue-50/50 text-sm rounded-lg outline-none transition-all placeholder:text-slate-500 text-slate-900"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <button 
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
                    aria-label="Notifications"
                >
                    <Bell size={20} strokeWidth={2} />
                </button>
                <button 
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
                    aria-label="Messages"
                >
                    <MessageSquare size={20} strokeWidth={2} />
                </button>

                <div className="relative ml-1 flex items-center">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-8 h-8 rounded-full bg-slate-200 hover:ring-2 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all flex items-center justify-center overflow-hidden"
                        aria-label="User Menu"
                    >
                        {/* Avatar */}
                        <img 
                            src="https://api.dicebear.com/7.x/notionists/svg?seed=InternHubUser&backgroundColor=f1f5f9" 
                            alt="User avatar" 
                            className="w-full h-full object-cover" 
                        />
                    </button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute right-0 top-12 w-52 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] py-1.5 overflow-hidden origin-top-right"
                            >
                                <div className="px-3 py-2.5 border-b border-gray-100/80 mb-1">
                                    <p className="text-sm font-medium text-slate-900">My Account</p>
                                    <p className="text-[13px] text-slate-500 truncate mt-0.5">student@internhub.ai</p>
                                </div>
                                <Link 
                                    to="/profile" 
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors mx-1 rounded-md"
                                >
                                    <User size={16} className="text-slate-400" /> 
                                    Profile
                                </Link>
                                <Link 
                                    to="/careervault" 
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors mx-1 rounded-md"
                                >
                                    <Bookmark size={16} className="text-slate-400" /> 
                                    Saved Items
                                </Link>
                                <Link 
                                    to="/settings" 
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors mx-1 rounded-md"
                                >
                                    <Settings size={16} className="text-slate-400" /> 
                                    Settings
                                </Link>
                                <div className="h-px bg-gray-100/80 my-1"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-[calc(100%-8px)] flex items-center gap-2.5 px-3 py-2 text-[14px] text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors mx-1 rounded-md text-left"
                                >
                                    <LogOut size={16} className="text-red-400" /> 
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

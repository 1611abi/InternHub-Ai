import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminTopbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin User' };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                {/* Optional Mobile Menu Button could go here */}
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pr-4 border-r border-surface-200">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                        {user.name?.charAt(0) || 'A'}
                    </div>
                    <span className="text-sm font-medium text-surface-700 hidden sm:block">
                        {user.name}
                    </span>
                </div>
                
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-surface-500 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                    title="Logout"
                >
                    <LogOut size={18} />
                    <span className="text-sm hidden sm:block">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default AdminTopbar;

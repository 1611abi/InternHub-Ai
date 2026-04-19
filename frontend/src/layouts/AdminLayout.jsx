import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';

const AdminLayout = () => {
    // Basic verification - this layout should only be accessible if role is 'admin'
    // (Actual auth logic is still handled by PrivateRoute in App.jsx, but this is an extra layer)
    const role = localStorage.getItem('role');
    
    // Check if the user is truly an admin (safety fallback)
    if (role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex h-screen w-full bg-surface-50 overflow-hidden">
            {/* Sidebar (visible on larger screens) */}
            <AdminSidebar />

            <div className="flex flex-col flex-1 min-w-0">
                {/* Admin-specific Topbar */}
                <AdminTopbar />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

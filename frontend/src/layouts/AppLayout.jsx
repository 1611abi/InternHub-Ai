import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/Topbar';

const AppLayout = () => {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-transparent">
            {/* Topbar spans the full width at the top */}
            <Topbar />
            
            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto w-full bg-transparent">
                    <div className="max-w-[1600px] mx-auto p-4 md:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;

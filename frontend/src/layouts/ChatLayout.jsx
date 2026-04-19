import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import ChatSidebar from '../components/ChatSidebar';

const ChatLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { id } = useParams();

    return (
        <div className="h-screen flex overflow-hidden bg-transparent">
            {/* Sidebar */}
            <ChatSidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                activeConversationId={id}
            />

            {/* Main chat area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Outlet context={{ sidebarOpen, onToggleSidebar: () => setSidebarOpen(!sidebarOpen) }} />
            </div>
        </div>
    );
};

export default ChatLayout;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft,
    MoreHorizontal, Pencil, Check, X, Briefcase
} from 'lucide-react';
import { getConversations, deleteConversation, updateConversationTitle } from '../services/api';

const ChatSidebar = ({ isOpen, onToggle, activeConversationId, onConversationDeleted }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [menuOpenId, setMenuOpenId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchConversations = async () => {
        try {
            const { data } = await getConversations();
            setConversations(data);
        } catch (err) {
            console.error('Failed to load conversations', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [location.pathname]);

    const handleNewChat = () => {
        navigate('/chat');
    };

    const handleDelete = async (id) => {
        try {
            await deleteConversation(id);
            setConversations(prev => prev.filter(c => c._id !== id));
            setMenuOpenId(null);
            if (activeConversationId === id) {
                navigate('/chat');
            }
            onConversationDeleted?.();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const handleRename = async (id) => {
        try {
            await updateConversationTitle(id, editTitle);
            setConversations(prev =>
                prev.map(c => c._id === id ? { ...c, title: editTitle } : c)
            );
            setEditingId(null);
        } catch (err) {
            console.error('Rename failed', err);
        }
    };

    const groupConversationsByDate = (conversations) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today - 86400000);
        const weekAgo = new Date(today - 7 * 86400000);

        const groups = { 'Today': [], 'Yesterday': [], 'Previous 7 Days': [], 'Older': [] };

        conversations.forEach(conv => {
            const date = new Date(conv.updatedAt || conv.createdAt);
            if (date >= today) groups['Today'].push(conv);
            else if (date >= yesterday) groups['Yesterday'].push(conv);
            else if (date >= weekAgo) groups['Previous 7 Days'].push(conv);
            else groups['Older'].push(conv);
        });

        return Object.entries(groups).filter(([, items]) => items.length > 0);
    };

    if (!isOpen) {
        return (
            <button
                onClick={onToggle}
                className="fixed top-20 left-3 z-40 p-2 bg-white border border-surface-200 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-50 transition-all shadow-sm"
                title="Open sidebar"
            >
                <PanelLeft size={18} />
            </button>
        );
    }

    return (
        <div className="w-72 h-full bg-white border-r border-surface-200 flex flex-col animate-slide-in-left">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-surface-200">
                <Link to="/" className="flex items-center gap-2 text-sm font-bold text-surface-900">
                    <Briefcase size={18} className="text-primary-600" />
                    InternHub AI
                </Link>
                <button
                    onClick={onToggle}
                    className="p-1.5 text-surface-400 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-all"
                    title="Close sidebar"
                >
                    <PanelLeftClose size={18} />
                </button>
            </div>

            {/* New Chat */}
            <div className="px-3 py-3">
                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-surface-600 border border-surface-200 rounded-lg hover:bg-surface-50 hover:text-surface-900 transition-all shadow-sm"
                >
                    <Plus size={16} /> New chat
                </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-2 pb-4">
                {loading ? (
                    <div className="space-y-2 px-2 pt-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="skeleton h-10 rounded-lg" />
                        ))}
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="px-4 py-8 text-center text-surface-400 text-sm">
                        No conversations yet. Start a new chat!
                    </div>
                ) : (
                    groupConversationsByDate(conversations).map(([label, items]) => (
                        <div key={label} className="mb-4">
                            <p className="px-3 py-1.5 text-xs font-medium text-surface-400 uppercase tracking-wider">
                                {label}
                            </p>
                            {items.map(conv => (
                                <div
                                    key={conv._id}
                                    className={`group relative flex items-center rounded-lg mx-1 transition-all ${conv._id === activeConversationId
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                                        }`}
                                >
                                    {editingId === conv._id ? (
                                        <div className="flex items-center gap-1 w-full px-2 py-1.5">
                                            <input
                                                value={editTitle}
                                                onChange={e => setEditTitle(e.target.value)}
                                                className="flex-1 bg-white border border-surface-300 rounded px-2 py-1 text-sm text-surface-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                                autoFocus
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') handleRename(conv._id);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                            />
                                            <button onClick={() => handleRename(conv._id)} className="p-1 text-green-600 hover:text-green-500">
                                                <Check size={14} />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="p-1 text-surface-400 hover:text-surface-600">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Link
                                                to={`/chat/${conv._id}`}
                                                className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-sm truncate"
                                            >
                                                <MessageSquare size={14} className="shrink-0 opacity-50" />
                                                <span className="truncate">{conv.title}</span>
                                            </Link>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 pr-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingId(conv._id);
                                                        setEditTitle(conv.title);
                                                    }}
                                                    className="p-1 text-surface-400 hover:text-surface-900 rounded transition-colors"
                                                    title="Rename"
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(conv._id);
                                                    }}
                                                    className="p-1 text-surface-400 hover:text-red-500 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;

import React, { useState, useEffect } from 'react';
import careervaultApi from '../../services/careervaultApi';
import { Check, X, ShieldAlert, ExternalLink, Calendar, User, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminModeration = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actioningId, setActioningId] = useState(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await careervaultApi.getPending();
            if (res.data.success) {
                setPending(res.data.data);
            }
        } catch (error) {
            console.error('Fetch Pending Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setActioningId(id);
        try {
            await careervaultApi.approve(id);
            setPending(prev => prev.filter(r => r._id !== id));
        } catch (error) {
            console.error('Approve Error:', error);
            alert('Failed to approve resource.');
        } finally {
            setActioningId(null);
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Are you sure you want to reject this resource?')) {
            setActioningId(id);
            try {
                await careervaultApi.reject(id);
                setPending(prev => prev.filter(r => r._id !== id));
            } catch (error) {
                console.error('Reject Error:', error);
                alert('Failed to reject resource.');
            } finally {
                setActioningId(null);
            }
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            youtube: 'bg-red-50 text-red-700 border-red-100',
            course: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            roadmap: 'bg-blue-50 text-blue-700 border-blue-100',
            notes: 'bg-amber-50 text-amber-700 border-amber-100',
            github: 'bg-slate-50 text-slate-700 border-slate-100'
        };
        return colors[type] || 'bg-slate-50 text-slate-700 border-slate-100';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Loading pending resources...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4 border border-rose-100">
                        <ShieldAlert size={14} />
                        Admin Access Only
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Resource <span className="text-primary-600">Moderation</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg max-w-2xl">
                        Review submissions for CareerVault. Ensure high-quality content for all users.
                    </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4 self-center md:self-auto">
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900 leading-none">{pending.length}</p>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">Pending Approval</p>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="popLayout">
                {pending.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {pending.map((res, i) => (
                            <motion.div
                                key={res._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex flex-col lg:flex-row gap-8">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(res.type)}`}>
                                                {res.type}
                                            </span>
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-200 bg-slate-50 text-slate-600">
                                                {res.field}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                                                res.difficulty === 'beginner' ? 'border-emerald-100 text-emerald-600 bg-emerald-50' :
                                                res.difficulty === 'intermediate' ? 'border-amber-100 text-amber-600 bg-amber-50' :
                                                'border-rose-100 text-rose-600 bg-rose-50'
                                            }`}>
                                                {res.difficulty}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2">
                                            {res.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                            {res.description}
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 uppercase tracking-tighter text-[9px]">Uploaded By</p>
                                                    <p className="text-slate-800 font-bold">{res.uploadedBy?.name || 'Anonymous'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                                    <Calendar size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 uppercase tracking-tighter text-[9px]">Submission Date</p>
                                                    <p className="text-slate-800 font-bold">
                                                        {new Date(res.createdAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-3 shrink-0 lg:w-48">
                                        <a 
                                            href={res.url || `http://localhost:5000${res.filePath}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
                                        >
                                            <ExternalLink size={16} /> Preview
                                        </a>
                                        <div className="h-px bg-slate-100 my-1 hidden lg:block"></div>
                                        <button 
                                            onClick={() => handleApprove(res._id)} 
                                            disabled={actioningId === res._id}
                                            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-primary-200 disabled:opacity-50"
                                        >
                                            <Check size={18} /> {actioningId === res._id ? 'Working...' : 'Approve'}
                                        </button>
                                        <button 
                                            onClick={() => handleReject(res._id)} 
                                            disabled={actioningId === res._id}
                                            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50"
                                        >
                                            <X size={18} /> {actioningId === res._id ? 'Working...' : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Check size={40} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">All Caught Up!</h2>
                        <p className="text-slate-500 mt-2">There are currently no resources waiting for review.</p>
                        <div className="mt-8">
                            <button 
                                onClick={() => window.location.href = '/admin/dashboard'}
                                className="text-primary-600 font-bold hover:underline"
                            >
                                Back to Main Dashboard
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="mt-20 pt-10 border-t border-slate-100">
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm">
                        <p className="text-amber-900 font-bold mb-1">Moderator Guideline</p>
                        <p className="text-amber-800/80 leading-relaxed">
                            Verify that links are safe and relevant. For PDF uploads, ensure they don't contain sensitive information or copyrighted material without permission. Resources should provide clear value to the student community.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminModeration;

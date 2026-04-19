import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import careervaultApi from '../../services/careervaultApi';
import { Folder as FolderIcon, ArrowLeft, Plus, Clock, BookOpen, Trash2 } from 'lucide-react';
import ResourceCard from '../../components/careervault/ResourceCard';
import { motion } from 'framer-motion';

const FolderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [folder, setFolder] = useState(null);
    const [loading, setLoading] = useState(true);
    // Determine if current user is the creator (in a real app, compare with auth context)
    const isCreator = true; // Hardcoded for demo, replace with real auth check

    useEffect(() => {
        fetchFolder();
    }, [id]);

    const fetchFolder = async () => {
        try {
            const res = await careervaultApi.getFolder(id);
            if (res.data.success) {
                setFolder(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this learning path?")) {
            try {
                // Assuming you have a deleteFolder route
                await careervaultApi.deleteFolder(id);
                navigate('/careervault/folders');
            } catch (err) {
                console.error(err);
                alert("Failed to delete folder.");
            }
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
                <div className="animate-pulse flex flex-col gap-6">
                    <div className="h-40 bg-slate-100 rounded-2xl"></div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    if (!folder) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col items-center">
                <FolderIcon size={64} className="text-slate-200 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Folder not found</h2>
                <p className="text-slate-500 mb-6">This learning path may have been deleted or doesn't exist.</p>
                <button onClick={() => navigate('/careervault/folders')} className="btn-primary px-6">Return to Folders</button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
            <button onClick={() => navigate('/careervault/folders')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium">
                <ArrowLeft size={16} /> Back to Learning Paths
            </button>

            {/* ── HEADER ── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                                <FolderIcon size={24} />
                            </div>
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-200">
                                {folder.field}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{folder.folderName}</h1>
                        <p className="text-lg text-slate-500 max-w-2xl mb-6 leading-relaxed">
                            {folder.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                <BookOpen size={16} className="text-blue-500" /> {folder.resourceIds?.length || 0} items
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                <Clock size={16} className="text-slate-400" /> Created {new Date(folder.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                By <span className="text-slate-700">{folder.createdBy?.name || 'Anonymous'}</span>
                            </div>
                        </div>
                    </div>
                    
                    {isCreator && (
                        <div className="flex shrink-0 items-start gap-3">
                            <button onClick={handleDelete} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100">
                                <Trash2 size={20} />
                            </button>
                            <Link to="/careervault" className="btn-primary px-5 py-2.5 flex items-center gap-2 shadow-md">
                                <Plus size={18} /> Add Resources
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* ── RESOURCES GRID ── */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Resources</h2>
            </div>
            
            {folder.resourceIds && folder.resourceIds.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {folder.resourceIds.map((res, i) => (
                        <motion.div
                            key={res._id || i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <ResourceCard resource={res} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white/50 border border-slate-200 rounded-2xl border-dashed">
                     <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                     <h3 className="text-xl font-bold text-slate-800 mb-2">Folder is empty</h3>
                     <p className="text-slate-500 max-w-sm mx-auto mb-6">This learning path doesn't have any resources yet. Browse the vault and add items to this collection.</p>
                     {isCreator && (
                         <Link to="/careervault" className="btn-primary px-6 inline-flex items-center gap-2">
                             Browse Vault
                         </Link>
                     )}
                </div>
            )}
        </div>
    );
};

export default FolderDetails;

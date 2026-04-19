import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import careervaultApi from '../../services/careervaultApi';
import { Folder as FolderIcon, Plus, X, Search, BookOpen, Clock } from 'lucide-react';

const FolderPage = () => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [newFolder, setNewFolder] = useState({
        folderName: '',
        description: '',
        field: 'Frontend'
    });

    const FIELDS = ['Frontend', 'Backend', 'Data Science', 'AI/ML', 'DevOps', 'UI/UX', 'Mobile'];

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        setLoading(true);
        try {
            const res = await careervaultApi.getFolders();
            if (res.data.success) {
                setFolders(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        try {
            const res = await careervaultApi.createFolder(newFolder);
            if (res.data.success) {
                setIsCreateModalOpen(false);
                setNewFolder({ folderName: '', description: '', field: 'Frontend' });
                fetchFolders();
            }
        } catch (err) {
            console.error("Error creating folder", err);
            alert("Error creating folder.");
        }
    };

    const filteredFolders = folders.filter(f => 
        f.folderName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
            
            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Structured Learning Paths</h1>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Discover community-curated collections of resources. Organize your learning journey with folders created by industry experts and peers.
                    </p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="shrink-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/25 flex items-center gap-2"
                >
                    <Plus size={20} strokeWidth={3} /> Create Path
                </button>
            </div>

            {/* ── SEARCH BAR ── */}
            <div className="bg-white border text-sm border-slate-200 p-2 rounded-xl shadow-sm mb-8 flex items-center max-w-md">
                <Search size={20} className="text-slate-400 ml-3 mr-2" />
                <input 
                    type="text"
                    placeholder="Search learning paths..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 py-2 text-slate-700 font-medium placeholder:font-normal"
                />
            </div>

            {/* ── FOLDERS GRID ── */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-white border border-slate-100 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50 to-transparent"></div>
                            <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4"></div>
                            <div className="w-3/4 h-5 bg-slate-100 rounded mb-2"></div>
                            <div className="w-full h-4 bg-slate-50 rounded mb-6"></div>
                            <div className="w-1/2 h-4 bg-slate-50 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : filteredFolders.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFolders.map(f => (
                        <Link to={`/careervault/folder/${f._id}`} key={f._id} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100">
                                    <FolderIcon size={24} />
                                </div>
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-200">
                                    {f.field}
                                </span>
                            </div>
                            
                            <h3 className="font-extrabold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {f.folderName}
                            </h3>
                            <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed flex-1">
                                {f.description}
                            </p>
                            
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                    <BookOpen size={14} className="text-slate-400" />
                                    {f.resourceIds.length} items
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                    <Clock size={14} /> {new Date(f.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/50 border border-slate-200 rounded-2xl border-dashed">
                     <FolderIcon size={48} className="mx-auto text-slate-300 mb-4" />
                     <h3 className="text-xl font-bold text-slate-800 mb-2">No learning paths found</h3>
                     <p className="text-slate-500">Create the first collection or try adjusting your search.</p>
                </div>
            )}

            {/* ── CREATE FOLDER MODAL ── */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <FolderIcon size={20} className="text-blue-600 fill-blue-100" /> Create Learning Path
                            </h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateFolder} className="p-6 flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-slate-700">Path Name <span className="text-red-500">*</span></label>
                                <input 
                                    required 
                                    value={newFolder.folderName} 
                                    onChange={e => setNewFolder({...newFolder, folderName: e.target.value})} 
                                    className="input-field py-2.5" 
                                    placeholder="e.g., Complete React Mastery" 
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-slate-700">Category <span className="text-red-500">*</span></label>
                                <select 
                                    value={newFolder.field} 
                                    onChange={e => setNewFolder({...newFolder, field: e.target.value})} 
                                    className="input-field py-2.5"
                                >
                                    {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-slate-700">Description <span className="text-red-500">*</span></label>
                                <textarea 
                                    required 
                                    value={newFolder.description} 
                                    onChange={e => setNewFolder({...newFolder, description: e.target.value})} 
                                    className="input-field py-2.5" 
                                    rows="3" 
                                    placeholder="What will users learn from this structured path?" 
                                />
                            </div>
                            <div className="pt-2 flex justify-end gap-3 mt-2">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-secondary px-5 py-2.5 text-sm">Cancel</button>
                                <button type="submit" className="btn-primary px-6 py-2.5 text-sm font-bold shadow-md">Create Path</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FolderPage;

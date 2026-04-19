import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, TrendingUp, BookOpen, Clock, Bookmark, Star, Code, BrainCircuit, Database, ShieldCheck, Palette, Cloud, Smartphone, MonitorPlay, FileText, Github } from 'lucide-react';
import careervaultApi from '../../services/careervaultApi';
import ResourceCard from '../../components/careervault/ResourceCard';
import { motion } from 'framer-motion';

const CareerVaultHome = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('popular'); // popular, newest, top-rated, most-saved
    const [selectedField, setSelectedField] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');

    const CATEGORIES = [
        { id: 'Web Development', label: 'Web Dev', icon: Code, count: '320+' },
        { id: 'Artificial Intelligence', label: 'AI & ML', icon: BrainCircuit, count: '150+' },
        { id: 'Data Science', label: 'Data', icon: Database, count: '180+' },
        { id: 'Cybersecurity', label: 'Security', icon: ShieldCheck, count: '90+' },
        { id: 'UI UX', label: 'UI/UX', icon: Palette, count: '110+' },
        { id: 'Cloud Computing', label: 'Cloud', icon: Cloud, count: '130+' },
        { id: 'Mobile Development', label: 'Mobile', icon: Smartphone, count: '140+' }
    ];

    const TYPES = ['All', 'youtube', 'course', 'roadmap', 'notes', 'github'];
    const DIFFICULTIES = ['All', 'beginner', 'intermediate', 'advanced'];

    useEffect(() => {
        fetchResources();
    }, [activeTab, selectedField, selectedType, selectedDifficulty]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = {
                sort: activeTab,
                limit: 20
            };
            if (selectedField !== 'All') params.field = selectedField;
            if (selectedType !== 'All') params.type = selectedType;
            if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
            const res = await careervaultApi.getResources(params);
            if (res.data.success) {
                setResources(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchResources();
            return;
        }
        setLoading(true);
        try {
            const res = await careervaultApi.search(searchQuery);
            if (res.data.success) {
                setResources(res.data.data);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-[#fafafa]">
            {/* ── LEAN HERO SECTION ── */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                    Career Vault
                </h1>
                <p className="text-slate-500 mb-6 max-w-2xl text-sm">
                    Discover curated roadmaps, free courses, notes, and tutorials.
                </p>
                
                <div className="flex items-center gap-3">
                    <Link to="/careervault/saved" className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <Bookmark size={16} /> Saved
                    </Link>
                    <Link to="/careervault/add" className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                        <Plus size={16} /> Add Resource
                    </Link>
                </div>
            </div>

            {/* ── BROWSE BY CATEGORY (LEAN) ── */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedField('All')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${selectedField === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                        All
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedField(cat.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border flex items-center gap-2 ${selectedField === cat.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── SEARCH & FILTERS (LEAN) ── */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <form onSubmit={handleSearch} className="flex-1 flex items-center relative">
                    <Search size={18} className="absolute left-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all placeholder:text-slate-400"
                    />
                </form>

                <div className="flex flex-wrap items-center gap-3">
                    <select 
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="bg-white border border-slate-200 text-slate-600 text-sm rounded-lg focus:outline-none focus:border-slate-300 py-2.5 px-3 cursor-pointer"
                    >
                        <option value="All">All Types</option>
                        {TYPES.filter(t => t !== 'All').map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                    </select>

                    <select 
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="bg-white border border-slate-200 text-slate-600 text-sm rounded-lg focus:outline-none focus:border-slate-300 py-2.5 px-3 cursor-pointer"
                    >
                        <option value="All">Any Difficulty</option>
                        {DIFFICULTIES.filter(d => d !== 'All').map(diff => <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>)}
                    </select>
                </div>
            </div>

            {/* ── SORTING TABS (LEAN) ── */}
            <div className="flex border-b border-slate-200 mb-6">
                {[
                    { id: 'popular', label: 'Popular' },
                    { id: 'newest', label: 'Newest' },
                    { id: 'top-rated', label: 'Top Rated' },
                    { id: 'most-saved', label: 'Saved' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>



            {/* ── RESOURCES GRID ── */}
            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-72 bg-white border border-slate-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-100/80 to-transparent"></div>
                            <div className="flex justify-between">
                                <div className="w-24 h-8 bg-slate-100 rounded-lg"></div>
                                <div className="w-8 h-8 bg-slate-100 rounded-xl"></div>
                            </div>
                            <div className="space-y-3 mt-2">
                                <div className="w-full h-5 bg-slate-100 rounded-md"></div>
                                <div className="w-3/4 h-5 bg-slate-100 rounded-md"></div>
                            </div>
                            <div className="space-y-2 flex-1 mt-2">
                                <div className="w-full h-3 bg-slate-50 rounded"></div>
                                <div className="w-5/6 h-3 bg-slate-50 rounded"></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-16 h-6 bg-slate-100 rounded-md"></div>
                                <div className="w-16 h-6 bg-slate-100 rounded-md"></div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex justify-between mt-auto">
                                <div className="w-20 h-5 bg-slate-50 rounded"></div>
                                <div className="w-16 h-4 bg-slate-50 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : resources.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 tracking-tight">
                    {resources.map((res, i) => (
                        <motion.div
                            key={res._id}
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.3, ease: 'easeOut' }}
                            className="h-full"
                        >
                            <ResourceCard resource={res} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-32 bg-white/50 border border-slate-200 rounded-2xl border-dashed">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <BookOpen size={36} className="text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight">No resources found</h3>
                    <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">It looks a little quite here. Be the first to share a valuable resource for this criteria.</p>
                    <Link to="/careervault/add" className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-semibold shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2">
                        <Plus size={20} className="stroke-[3]" /> Add Resource
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CareerVaultHome;

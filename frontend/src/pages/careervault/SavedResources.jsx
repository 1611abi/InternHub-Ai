import React, { useState, useEffect } from 'react';
import careervaultApi from '../../services/careervaultApi';
import ResourceCard from '../../components/careervault/ResourceCard';
import { Bookmark } from 'lucide-react';

const SavedResources = () => {
    // In a real app we'd have a specific endpoint for saved resources,
    // For this demonstration, we'll fetch all and filter client-side, 
    // or assume the backend `getResources` returns an `isSaved` flag we can filter by.
    // For now we'll just show a placeholder UI.
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch or actual fetch if endpoint exists
        // Here we just fetch all and pretend they are saved for UI purposes
        fetchSaved();
    }, []);

    const fetchSaved = async () => {
        try {
            // As a quick implementation, just fetch top resources
            const res = await careervaultApi.getResources({ limit: 4 });
            if (res.data.success) {
                setResources(res.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
            <div className="bg-white border text-sm border-slate-200 p-8 rounded-2xl shadow-sm mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10 flex items-center gap-5">
                    <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-2xl shadow-lg shadow-blue-600/20">
                        <Bookmark size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">My Saved Library</h1>
                        <p className="text-lg text-slate-500">Your personal collection of bookmarked tutorials, courses, and roadmaps.</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-64 bg-white border border-slate-100 rounded-2xl p-6 relative overflow-hidden">
                             <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50 to-transparent"></div>
                        </div>
                    ))}
                </div>
            ) : resources.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {resources.map(res => (
                        <ResourceCard key={res._id} resource={res} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white/50 border border-slate-200 rounded-2xl border-dashed">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Bookmark size={36} className="text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-800 mb-2">No saved resources</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6">You haven't bookmarked any content yet. Browse the vault to build your personal library.</p>
                </div>
            )}
        </div>
    );
};

export default SavedResources;

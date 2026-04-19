import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpCircle, Bookmark, AlertTriangle, Download, ExternalLink, Share2, MessageCircle, Github } from 'lucide-react';
import careervaultApi from '../../services/careervaultApi';
import Rating from '../../components/careervault/Rating';
import ResourceCard from '../../components/careervault/ResourceCard';

const ResourceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);

    const [upvotes, setUpvotes] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    const [related, setRelated] = useState([]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await careervaultApi.getResource(id);
            if (res.data.success) {
                setResource(res.data.data);
                setUpvotes(res.data.data.upvotes);

                // Fetch related resources
                try {
                    const relatedRes = await careervaultApi.getByField(res.data.data.field);
                    if (relatedRes.data.success) {
                        setRelated(relatedRes.data.data.filter(r => r._id !== id).slice(0, 3));
                    }
                } catch (e) {
                    console.error("Error fetching related resources:", e);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async () => {
        try {
            const res = await careervaultApi.upvote(id);
            if (res.data.success) {
                setUpvotes(res.data.upvotes);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            const res = await careervaultApi.save(id);
            if (res.data.success) {
                setIsSaved(!isSaved); // In real app, sync this state properly
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRate = async (value) => {
        try {
            await careervaultApi.rate(id, value);
            alert('Rating submitted successfully!');
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReport = async () => {
        const reason = prompt('Please describe why this resource should be reported:');
        if (reason && reason.trim()) {
            try {
                await careervaultApi.report(id, reason.trim());
                alert('Report submitted for review.');
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) {
        return <div className="p-20 text-center text-slate-400">Loading resource...</div>;
    }

    if (!resource) {
        return <div className="p-20 text-center">Resource not found.</div>;
    }

    // Function to extract Youtube ID for embed
    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const isYoutube = resource.type === 'youtube' && resource.url;
    const yId = isYoutube ? getYoutubeId(resource.url) : null;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium">
                <ArrowLeft size={16} /> Back to Vault
            </button>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

                {/* ── HEADER ── */}
                <div className="p-8 border-b border-slate-100 pb-6">
                    <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                        <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider text-[10px]">
                            {resource.type}
                        </span>
                        <span className="bg-slate-100 text-slate-600 font-medium px-3 py-1 rounded-full border border-slate-200">
                            {resource.field}
                        </span>
                        <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide
                            ${resource.difficulty === 'beginner' ? 'bg-green-50 text-green-700 border-green-200' :
                                resource.difficulty === 'intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    'bg-rose-50 text-rose-700 border-rose-200'}`}>
                            {resource.difficulty}
                        </span>
                        <span className="text-slate-400 text-xs ml-auto">
                            Posted {new Date(resource.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight">
                        {resource.title}
                    </h1>

                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-700">Rate this:</span>
                            <Rating value={Math.round(resource.averageRating)} onRate={handleRate} size={20} />
                            <span className="text-xs text-slate-400 ml-1">({resource.averageRating.toFixed(1)} avg)</span>
                        </div>
                    </div>
                </div>

                {/* ── MEDIA EXPERIENCES ── */}
                <div className="bg-slate-50 p-8 border-b border-slate-100">

                    {isYoutube && yId ? (
                        <div className="aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-black">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${yId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>
                            </iframe>
                        </div>
                    ) : resource.type === 'course' && resource.url ? (
                        <div className="bg-white border text-center border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center">
                            <ExternalLink size={48} className="text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 mb-2">External Course</h3>
                            <p className="text-slate-500 mb-6 text-sm">This resource is hosted on an external platform.</p>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                                Go to Course <ExternalLink size={16} className="ml-2" />
                            </a>
                        </div>
                    ) : resource.type === 'github' && resource.url ? (
                        <div className="bg-white border text-center border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center shadow-sm">
                            <Github size={48} className="text-slate-800 mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 mb-2">GitHub Repository</h3>
                            <p className="text-slate-500 mb-6 text-sm">Explore the source code for this resource.</p>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-lg font-bold shadow-md transition-all inline-flex items-center gap-2 bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 text-white">
                                <Github size={18} /> View on GitHub
                            </a>
                        </div>
                    ) : resource.filePath ? (
                        <div className="bg-white border text-center border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center shadow-sm">
                            <Download size={48} className="text-blue-500 mb-4 bg-blue-50 p-3 rounded-full" />
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Download Document</h3>
                            <p className="text-slate-500 mb-6 text-sm">Get the PDF notes or roadmap layout.</p>
                            <a href={`http://localhost:5000${resource.filePath}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
                                Download File <Download size={16} className="ml-2" />
                            </a>
                        </div>
                    ) : (
                        <div className="text-slate-500 text-center italic">No media attached to this resource.</div>
                    )}
                </div>

                {/* ── BODY ── */}
                <div className="p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Description</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap mb-8 text-[15px]">
                        {resource.description}
                    </p>

                    {resource.tags && resource.tags.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2">
                            {resource.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* ── ACTIONS ── */}
                    <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-100">
                        <button
                            onClick={handleUpvote}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <ArrowUpCircle size={20} className="text-blue-600" />
                            <span>Upvote ({upvotes})</span>
                        </button>

                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl font-semibold transition-all shadow-sm ${isSaved ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                            <Bookmark size={20} className={isSaved ? 'fill-blue-600 text-blue-600' : 'text-slate-500'} />
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>

                        <div className="flex-1"></div>

                        <button
                            onClick={handleReport}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        >
                            <AlertTriangle size={14} /> Report
                        </button>
                    </div>
                </div>
            </div>

            {/* ── RELATED RESOURCES ── */}
            {related.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Related Resources</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {related.map(r => (
                            <ResourceCard key={r._id} resource={r} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceDetails;

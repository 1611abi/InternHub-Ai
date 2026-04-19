import React, { useState, useEffect } from 'react';
import { Search, Loader2, ExternalLink, MapPin, Building2, Layers, Bookmark, Briefcase, Sparkles } from 'lucide-react';
import { searchInternships, getPlatformJobs } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import ApplyJobModal from '../components/ApplyJobModal';
import JobRecommendation from '../components/JobRecommendation';

const InternshipSearch = () => {
    const [activeTab, setActiveTab] = useState('external'); // 'external' or 'internal'

    // External search state
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [internships, setInternships] = useState([]);
    const [error, setError] = useState('');

    // Internal jobs state
    const [platformJobs, setPlatformJobs] = useState([]);
    const [platformLoading, setPlatformLoading] = useState(false);
    const [platformError, setPlatformError] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // Fetch internal jobs when component mounts or internal tab focuses
    useEffect(() => {
        if (activeTab === 'internal' && platformJobs.length === 0) {
            fetchPlatformJobs();
        }
    }, [activeTab]);

    const fetchPlatformJobs = async () => {
        setPlatformLoading(true);
        setPlatformError('');
        try {
            const { data } = await getPlatformJobs();
            setPlatformJobs(data);
        } catch (err) {
            setPlatformError('Failed to load platform jobs. Please try again.');
            console.error(err);
        } finally {
            setPlatformLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!domain.trim()) return;

        setLoading(true);
        setError('');
        try {
            const { data } = await searchInternships(domain);
            setInternships(data);
            if (data.length === 0) setError('No internships found. Try another domain.');
        } catch (err) {
            setError('Failed to fetch internships. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openApplyModal = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center mb-10"
            >
                <h1 className="text-3xl font-bold text-surface-900 mb-2">Discover Opportunities</h1>
                <p className="text-surface-500">Find the perfect role, either from our platform partners or across the web.</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex bg-surface-100 p-1.5 rounded-xl border border-surface-200">
                    <button
                        onClick={() => setActiveTab('external')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                            activeTab === 'external' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                        }`}
                    >
                        <Search size={16} /> Web Search
                    </button>
                    <button
                        onClick={() => setActiveTab('internal')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                            activeTab === 'internal' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                        }`}
                    >
                        <Briefcase size={16} /> Platform Jobs
                    </button>
                    <button
                        onClick={() => setActiveTab('ai-match')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                            activeTab === 'ai-match' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                        }`}
                    >
                        <Sparkles size={16} /> AI Match
                    </button>
                </div>
            </div>

            {/* Tab Content: External */}
            {activeTab === 'external' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <form onSubmit={handleSearch} className="mb-10">
                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                className="input-field py-4 px-6 pl-12 rounded-xl shadow-sm"
                                placeholder="Search domain (e.g. Web Development, AI, Backend...)"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-5 text-sm rounded-lg"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Search'}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center text-sm mb-8">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {internships.map((job, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="surface p-5 flex flex-col justify-between hover:border-surface-300 hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <div>
                                        <div className="mb-3">
                                            <span className="badge-primary text-xs uppercase">
                                                {job.source}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-surface-900 mb-2 line-clamp-2">{job.title}</h3>
                                        <div className="flex items-center gap-2 text-surface-500 text-xs mb-1">
                                            <Building2 size={13} />
                                            <span>{job.company}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-surface-500 text-xs mb-4">
                                            <MapPin size={13} />
                                            <span>{job.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={job.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-secondary flex-grow py-2 text-xs"
                                        >
                                            View <ExternalLink size={13} />
                                        </a>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const { saveInternship } = await import('../services/api');
                                                    await saveInternship(job);
                                                } catch (err) {
                                                    console.error('Save failed', err);
                                                }
                                            }}
                                            className="p-2 bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white rounded-lg transition-all border border-primary-200"
                                            title="Save"
                                        >
                                            <Bookmark size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {!loading && internships.length === 0 && !error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-16 h-16 rounded-xl bg-surface-100 border border-surface-200 flex items-center justify-center mx-auto mb-4">
                                <Layers size={28} className="text-surface-400" />
                            </div>
                            <h2 className="text-lg font-medium text-surface-400">Enter a domain to start discovery</h2>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Tab Content: Internal */}
            {activeTab === 'internal' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {platformLoading ? (
                        <div className="flex flex-col flex-1 items-center justify-center p-20 text-surface-500">
                            <Loader2 size={32} className="animate-spin text-primary-500 mb-4" />
                            <p>Loading platform jobs...</p>
                        </div>
                    ) : platformError ? (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center text-sm mb-8">
                            {platformError}
                        </div>
                    ) : platformJobs.length === 0 ? (
                        <div className="text-center p-20 bg-surface-50 border border-surface-200 border-dashed rounded-xl">
                            <Briefcase size={32} className="mx-auto mb-4 opacity-50 text-surface-400" />
                            <h3 className="font-semibold text-surface-900 mb-2">No Platform Jobs Yet</h3>
                            <p className="text-sm text-surface-500">Recruiters haven't posted any jobs directly on the platform yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {platformJobs.map(job => (
                                <motion.div 
                                    key={job._id} 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="surface-elevated hover:shadow-card transition-shadow bg-white p-5 rounded-xl border border-surface-200 flex flex-col h-full"
                                >
                                    <div className="mb-4 flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg text-surface-900 leading-tight">{job.title}</h3>
                                            <span className="badge-success text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                Platform
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-primary-600 mb-3">{job.companyName}</p>
                                        
                                        <div className="space-y-1.5 text-xs text-surface-600 mb-4 bg-surface-50 p-3 rounded-lg border border-surface-100">
                                            <p className="flex items-center gap-2"><MapPin size={12} className="text-surface-400" /> {job.location}</p>
                                            <p className="flex items-center gap-2">💰 {job.stipend || 'Unpaid'}</p>
                                        </div>
                                        
                                        <p className="text-sm text-surface-600 line-clamp-3 mb-4">
                                            {job.description}
                                        </p>
                                        
                                        {job.skillsRequired && job.skillsRequired.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {job.skillsRequired.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="text-[10px] bg-surface-100 text-surface-600 px-2 py-1 rounded border border-surface-200">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.skillsRequired.length > 3 && (
                                                    <span className="text-[10px] bg-surface-50 text-surface-500 px-2 py-1 rounded">
                                                        +{job.skillsRequired.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-4 border-t border-surface-200 mt-auto flex justify-between items-center">
                                        <span className="text-[10px] text-surface-400 font-medium tracking-wide">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                        <button 
                                            onClick={() => openApplyModal(job)}
                                            className="btn-primary py-1.5 px-4 text-xs shadow-sm hover:shadow-md transition-shadow flex items-center gap-1"
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Tab Content: AI Match */}
            {activeTab === 'ai-match' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <JobRecommendation />
                </motion.div>
            )}

            {/* Application Modal */}
            <ApplyJobModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                job={selectedJob} 
            />
        </div>
    );
};

export default InternshipSearch;

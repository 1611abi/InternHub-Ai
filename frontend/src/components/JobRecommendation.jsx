import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Loader2, MapPin, Briefcase, FileText } from 'lucide-react';
import { recommendJobs } from '../services/api';
import ApplyJobModal from './ApplyJobModal';

const JobRecommendation = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setFile(null);
            setError('Please select a valid PDF file.');
        }
    };

    const handleUploadAndAnalyze = async () => {
        if (!file) return;

        setLoading(true);
        setError('');
        
        try {
            const formData = new FormData();
            formData.append('resume', file);
            
            const { data } = await recommendJobs(formData);
            setJobs(data || []);
            
            if (data.length === 0) {
                setError('No match was found or no jobs found based on your skills.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to analyze resume or fetch recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const openApplyModal = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full">
            {/* Upload Area */}
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-8 mb-8 text-center shadow-sm">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-200 text-primary-600">
                        <FileText size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-surface-900 mb-2">AI Job Matcher</h3>
                    <p className="text-surface-500 mb-6 text-sm">Upload your resume and our AI will match you with the best roles from our database instantly.</p>
                    
                    <div className="mb-6 relative">
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="border-2 border-dashed border-primary-300 rounded-lg py-8 px-4 bg-white hover:bg-primary-50 transition-colors">
                            {file ? (
                                <div className="text-primary-700 font-medium text-sm flex items-center justify-center gap-2">
                                    <FileText size={18} /> {file.name}
                                </div>
                            ) : (
                                <div className="text-surface-600 text-sm flex flex-col items-center">
                                    <UploadCloud size={32} className="mb-2 text-primary-400" />
                                    <span className="font-semibold text-primary-600">Click to browse</span> or drag & drop<br/>
                                    <span className="text-xs text-surface-400 mt-1">PDF format (max. 5MB)</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <button
                        onClick={handleUploadAndAnalyze}
                        disabled={!file || loading}
                        className="btn-primary w-full py-3 rounded-xl disabled:bg-surface-300 disabled:text-surface-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Find Matches'}
                    </button>
                    
                    {error && <p className="text-red-500 text-sm mt-4 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
                </div>
            </div>

            {/* Results */}
            {jobs.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                        <span>✨ Your Top Matches</span>
                        <span className="badge-primary px-2 py-0.5 rounded-full text-xs">{jobs.length} Found</span>
                    </h3>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {jobs.map((job, idx) => (
                                <motion.div 
                                    key={job._id || idx}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="surface-elevated hover:shadow-card transition-all duration-300 bg-white p-5 rounded-xl border border-surface-200 flex flex-col h-full relative overflow-hidden"
                                >
                                    {/* Score Badge */}
                                    <div className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                                        {job.similarityScore}% Match
                                    </div>
                                    
                                    <div className="mb-4 flex-grow pt-3">
                                        <h3 className="font-semibold text-lg text-surface-900 leading-tight mb-1 pr-12">{job.title}</h3>
                                        <p className="text-sm font-medium text-primary-600 mb-3">{job.companyName}</p>
                                        
                                        <div className="space-y-1.5 text-xs text-surface-600 mb-4 bg-gradient-to-br from-surface-50 to-white p-3 rounded-lg border border-surface-100">
                                            <p className="flex items-center gap-2"><MapPin size={12} className="text-surface-400" /> {job.location}</p>
                                            <p className="flex items-center gap-2"><Briefcase size={12} className="text-surface-400" /> 💰 {job.stipend || 'Unpaid'}</p>
                                        </div>
                                        
                                        <p className="text-sm text-surface-600 line-clamp-3 mb-4 leading-relaxed">
                                            {job.description}
                                        </p>
                                        
                                        {job.skillsRequired && job.skillsRequired.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {job.skillsRequired.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="text-[10px] bg-primary-50 text-primary-700 px-2 py-1 rounded border border-primary-100 font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.skillsRequired.length > 3 && (
                                                    <span className="text-[10px] bg-surface-100 text-surface-500 px-2 py-1 rounded font-medium border border-surface-200">
                                                        +{job.skillsRequired.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="pt-4 border-t border-surface-100 mt-auto">
                                        <button 
                                            onClick={() => openApplyModal(job)}
                                            className="w-full btn-primary py-2 text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group"
                                        >
                                            Apply for Role
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
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

export default JobRecommendation;

import React, { useState } from 'react';
import { recommendJobs } from '../services/api';
import { FiUploadCloud, FiBriefcase, FiMapPin, FiExternalLink, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const JobRecommenderPage = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleRecommend = async () => {
        if (!file) {
            setError('Please upload a resume in PDF format.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        setLoading(true);
        setError('');
        setResults([]);
        setSearched(true);

        try {
            const response = await recommendJobs(formData);
            setResults(response.data.ranked_jobs || response.data.recommended_jobs || []);
            
            if (response.data.ranked_jobs?.length === 0) {
                setError('No match was found or no jobs found based on your skills.');
            }
        } catch (err) {
            console.error('Job Recommender Error:', err);
            setError(err.response?.data?.message || 'Failed to recommend jobs. Ensure ML service is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Job Recommender</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Upload your resume to instantly match with top industry roles using our semantic ML model.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-100 dark:border-gray-700">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <label className="flex flex-col items-center justify-center w-full md:w-2/3 h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FiUploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                                    {file ? (
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> your resume (PDF)</p>
                                    )}
                                </div>
                                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                            </label>
                            
                            <button
                                onClick={handleRecommend}
                                disabled={loading || !file}
                                className={`w-full md:w-1/3 h-16 rounded-xl font-medium text-white transition-all text-lg
                                    ${loading || !file ? 'bg-indigo-400 cursor-not-allowed hidden md:block' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg focus:ring-4 focus:ring-indigo-300'}
                                `}
                            >
                                {loading ? 'Scanning DB...' : 'Find Matches'}
                            </button>
                            {/* Mobile button variant */}
                            <button
                                onClick={handleRecommend}
                                disabled={loading || !file}
                                className={`w-full md:hidden h-14 rounded-xl font-medium text-white transition-all text-lg
                                    ${loading || !file ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                                `}
                            >
                                {loading ? 'Scanning DB...' : 'Find Matches'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Errors */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start">
                        <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                    </div>
                )}

                {/* Results Section */}
                {searched && results.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Top Matches ({results.length})</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {results.map((job, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 relative overflow-hidden"
                                >
                                    {/* Match Badge */}
                                    {job.match_percentage && (
                                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-lg">
                                            {job.match_percentage}% MATCH
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 pr-16">{job.title}</h3>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                <FiBriefcase className="mr-1.5" />
                                                <span className="truncate max-w-[150px]">{job.company_name}</span>
                                                <span className="mx-2">•</span>
                                                <FiMapPin className="mr-1.5" />
                                                <span>Remote / Hybrid</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills Tags */}
                                    <div className="mb-6 flex flex-wrap gap-2">
                                        {job.skillsRequired && job.skillsRequired.slice(0, 4).map((skill, i) => (
                                            <span key={i} className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600">
                                                {skill}
                                            </span>
                                        ))}
                                        {job.skillsRequired && job.skillsRequired.length > 4 && (
                                            <span className="px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                +{job.skillsRequired.length - 4} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                                            Industry Pick
                                        </span>
                                        
                                        <a 
                                            href={job.job_link || '#'} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                        >
                                            View Details <FiExternalLink className="ml-1.5" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobRecommenderPage;

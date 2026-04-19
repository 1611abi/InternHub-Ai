import React, { useState } from 'react';
import { analyzeSkillGapNew } from '../services/api';
import { FiUploadCloud, FiCheckCircle, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SkillGapAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!file || !jobDescription.trim()) {
            setError('Please upload a resume and paste a job description.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await analyzeSkillGapNew(formData);
            setResult(response.data);
        } catch (err) {
            console.error('Skill Gap Error:', err);
            setError(err.response?.data?.message || 'Failed to analyze skill gap.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skill Gap Analysis</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Compare your resume against a specific job description to find missing skills.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Input Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Input Details</h2>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                1. Upload Resume (PDF)
                            </label>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                    {file ? (
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag & drop</p>
                                    )}
                                </div>
                                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                            </label>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                2. Paste Job Description
                            </label>
                            <textarea
                                rows={6}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Paste the full job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !file || !jobDescription.trim()}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
                                ${loading || !file || !jobDescription.trim() ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                            `}
                        >
                            {loading ? 'Analyzing Skills...' : 'Analyze Match'}
                        </button>

                        {error && (
                            <p className="mt-4 text-red-500 text-sm flex items-center">
                                <FiAlertCircle className="mr-2" /> {error}
                            </p>
                        )}
                    </div>

                    {/* Results Section */}
                    {result ? (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Match Results</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on industry terminology</p>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border-4 border-indigo-100 dark:border-indigo-800">
                                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.matchPercentage}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                        <FiCheckCircle className="text-green-500 mr-2" /> Matching Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.matchingSkills && result.matchingSkills.length > 0 ? (
                                            result.matchingSkills.map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium border border-green-200 dark:border-green-800">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No skills matched.</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                        <FiCheckCircle className="text-indigo-500 mr-2" /> Partially Matching Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.partiallyMatchingSkills && result.partiallyMatchingSkills.length > 0 ? (
                                            result.partiallyMatchingSkills.map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full text-sm font-medium border border-indigo-200 dark:border-indigo-800">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No partial matches identified.</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                        <FiAlertCircle className="text-red-500 mr-2" /> Missing Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingSkills && result.missingSkills.length > 0 ? (
                                            result.missingSkills.map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-medium border border-red-200 dark:border-red-800">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">You have all the required skills!</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Semantic Summary */}
                            {(result.summary || result.analysis) && (
                                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Semantic Similarity Analysis</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{result.summary}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">{result.analysis}</p>
                                </div>
                            )}

                            {result.missingSkills && result.missingSkills.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 flex items-start">
                                        <FiTrendingUp className="text-indigo-600 dark:text-indigo-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-300">Improvement Suggestion</h4>
                                            <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
                                                Consider taking a short course or building a project involving <strong>{result.missingSkills[0]}</strong> to boost your match percentage.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    ) : (
                        <div className="hidden lg:flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
                            <FiUploadCloud className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300">Ready for Analysis</h3>
                            <p className="text-gray-500 dark:text-gray-500 max-w-sm mt-2">
                                Upload your resume and job description on the left to see your personalized skill gap breakdown.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillGapAnalyzer;

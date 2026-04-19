import React, { useState } from 'react';
import { scoreResume } from '../services/api';
import { FiUploadCloud, FiCheckCircle, FiAlertCircle, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ATSScorePage = () => {
    const [file, setFile] = useState(null);
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
        if (!file) {
            setError('Please upload a resume in PDF format.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await scoreResume(formData);
            setResult(response.data);
        } catch (err) {
            console.error('ATS Score Error:', err);
            setError(err.response?.data?.message || 'Failed to analyze resume.');
        } finally {
            setLoading(false);
        }
    };

    // Circular Progress UI Component
    const CircularProgress = ({ score }) => {
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;
        
        let colorClass = 'text-red-500';
        if (score >= 40) colorClass = 'text-yellow-500';
        if (score >= 75) colorClass = 'text-green-500';

        return (
            <div className="relative flex items-center justify-center">
                <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        className={colorClass}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{score}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/ 100</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ATS Resume Score</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Upload your resume to see how well it performs against modern Applicant Tracking Systems.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
                    <div className="p-8">
                        <div className="flex flex-col items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FiUploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                                    {file ? (
                                        <p className="mb-2 text-sm text-gray-900 dark:text-white font-medium">
                                            Selected: {file.name}
                                        </p>
                                    ) : (
                                        <>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">PDF ONLY (MAX. 5MB)</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                            </label>
                            
                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !file}
                                className={`mt-6 w-full md:w-auto px-8 py-3 rounded-lg font-medium text-white transition-colors
                                    ${loading || !file ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                                `}
                            >
                                {loading ? 'Analyzing with ML...' : 'Get ATS Score'}
                            </button>
                            
                            {error && (
                                <p className="mt-4 text-red-500 text-sm flex items-center">
                                    <FiAlertCircle className="mr-2" /> {error}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {result && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Score Card */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">ATS Compatibility</h3>
                            <CircularProgress score={result.score} />
                            
                            <div className="w-full mt-8 space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-gray-500">Formatting & Structure</span>
                                        <span className="text-gray-900 dark:text-white">{result.formattingScore}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                        <div 
                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" 
                                            style={{ width: `${result.formattingScore}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-gray-500">Content & Metrics</span>
                                        <span className="text-gray-900 dark:text-white">{result.contentScore}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                        <div 
                                            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000" 
                                            style={{ width: `${result.contentScore}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                                {result.score >= 80 ? 'Excellent! Your resume is highly ATS optimized.' 
                                : result.score >= 50 ? 'Good, but there is room for optimization.' 
                                : 'Needs Work. ATS systems may struggle to parse this.'}
                            </p>
                        </div>

                        {/* Details Cards */}
                        <div className="md:col-span-2 space-y-6">
                            
                            {/* Skills Section */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                    <FiCheckCircle className="text-green-500 mr-2" /> Detected Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.matchingSkills && result.matchingSkills.length > 0 ? (
                                        result.matchingSkills.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium border border-green-200 dark:border-green-800">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No strong technical skills detected.</p>
                                    )}
                                </div>
                            </div>

                            {/* Missing Keywords Section */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                    <FiAlertCircle className="text-yellow-500 mr-2" /> Missing Standard Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingSkills && result.missingSkills.length > 0 ? (
                                        result.missingSkills.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-sm font-medium border border-yellow-200 dark:border-yellow-800">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Your resume contains all standard industry keywords.</p>
                                    )}
                                </div>
                            </div>

                            {/* Suggestions Section */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                    <FiFileText className="text-blue-500 mr-2" /> Formatting & Content Suggestions
                                </h3>
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                    {result.suggestions && result.suggestions.length > 0 ? (
                                        result.suggestions.map((suggestion, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 mr-3 text-xs mt-0.5 flex-shrink-0">
                                                    {idx + 1}
                                                </span>
                                                {suggestion}
                                            </li>
                                        ))
                                    ) : (
                                        <p>No major structural suggestions. Keep updating content based on the job description.</p>
                                    )}
                                </ul>
                            </div>

                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ATSScorePage;

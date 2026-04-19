import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { 
    User, Mail, Phone, ExternalLink, 
    CheckCircle, XCircle, Clock, ArrowLeft,
    ChevronRight, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecruiterApplicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                
                // Fetch job details (we could optimize this if we had a single job endpoint)
                const { data: myJobs } = await axios.get(`${backendUrl}/recruiter/my-jobs`, config);
                const currentJob = myJobs.find(j => j._id === jobId);
                setJob(currentJob);

                const { data } = await axios.get(`${backendUrl}/recruiter/applicants/${jobId}`, config);
                setApplicants(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load applicants.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [jobId]);

    const handleStatusUpdate = async (applicationId, status) => {
        try {
            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const endpoint = status === 'shortlisted' ? 'accept' : 'reject';
            
            await axios.put(`${backendUrl}/recruiter/application/${applicationId}/${endpoint}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            setApplicants(prev => prev.map(app => 
                app._id === applicationId ? { ...app, status } : app
            ));
        } catch (err) {
            console.error(err);
            alert('Failed to update status.');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <header className="mb-8">
                <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-surface-500 hover:text-primary-600 text-sm mb-4 transition-colors">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
                             Applicants for {job?.title || 'Job'}
                        </h1>
                        <p className="text-surface-500 mt-1">{applicants.length} candidates applied</p>
                    </div>
                </div>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center mb-8">
                    {error}
                </div>
            )}

            {applicants.length === 0 ? (
                <div className="surface p-20 text-center border-2 border-dashed border-surface-200 rounded-2xl bg-surface-50">
                    <User className="mx-auto mb-4 text-surface-200" size={48} />
                    <h2 className="text-xl font-bold text-surface-400">No applicants yet</h2>
                    <p className="text-surface-500 mt-2">Check back later once candidates start applying.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence>
                        {applicants.map((app, i) => (
                            <motion.div 
                                key={app._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="surface p-6 border border-surface-200 hover:border-primary-200 transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center text-primary-600 font-bold text-lg shrink-0">
                                            {app.applicantName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-surface-900 flex items-center gap-2">
                                                {app.applicantName}
                                                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                    app.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </h3>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-surface-500">
                                                <span className="flex items-center gap-1"><Mail size={14} /> {app.applicantEmail}</span>
                                                <span className="flex items-center gap-1"><Phone size={14} /> {app.applicantPhone}</span>
                                                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(app.appliedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <a 
                                            href={app.resumeLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn-secondary flex items-center gap-2 py-2 px-4 whitespace-nowrap"
                                        >
                                            <ExternalLink size={16} /> View Resume
                                        </a>

                                        {app.status === 'applied' && (
                                            <div className="flex items-center gap-2 pl-4 border-l border-surface-200">
                                                <button 
                                                    onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                                                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                    title="Accept Candidate"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    title="Reject Candidate"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default RecruiterApplicants;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Send, FileText, User, Mail, Phone, ExternalLink } from 'lucide-react';
import { applyForJob } from '../services/api';

const ApplyJobModal = ({ isOpen, onClose, job }) => {
    const [formData, setFormData] = useState({
        applicantName: '',
        applicantEmail: '',
        applicantPhone: '',
        resumeLink: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isOpen || !job) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await applyForJob(job._id, formData);
            setSuccess('Application submitted successfully!');
            setTimeout(() => {
                onClose();
                setSuccess('');
                setFormData({ applicantName: '', applicantEmail: '', applicantPhone: '', resumeLink: '' });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg overflow-hidden bg-white shadow-2xl rounded-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Apply for Role</h2>
                            <p className="inline-flex mt-1 text-sm font-medium text-slate-500">
                                {job.title} <span className="mx-2 text-slate-300">•</span> {job.companyName}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 transition-colors rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-8 text-center"
                            >
                                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-emerald-100 text-emerald-600">
                                    <Send size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Application Sent!</h3>
                                <p className="mt-1 text-sm text-slate-500">The recruiter will review your profile shortly.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 text-sm text-red-600 rounded-lg bg-red-50 border border-red-100">
                                        {error}
                                    </div>
                                )}
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-slate-700">Full Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="text"
                                                name="applicantName"
                                                required
                                                value={formData.applicantName}
                                                onChange={handleChange}
                                                className="w-full py-2.5 pl-10 pr-4 text-sm bg-white border outline-none rounded-xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-slate-700">Email Address *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input
                                                    type="email"
                                                    name="applicantEmail"
                                                    required
                                                    value={formData.applicantEmail}
                                                    onChange={handleChange}
                                                    className="w-full py-2.5 pl-10 pr-4 text-sm bg-white border outline-none rounded-xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-slate-700">Phone Number *</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input
                                                    type="tel"
                                                    name="applicantPhone"
                                                    required
                                                    value={formData.applicantPhone}
                                                    onChange={handleChange}
                                                    className="w-full py-2.5 pl-10 pr-4 text-sm bg-white border outline-none rounded-xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                    placeholder="+1 234 567 890"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-slate-700">Cancel / Portfolio Link *</label>
                                        <div className="relative">
                                            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="url"
                                                name="resumeLink"
                                                required
                                                value={formData.resumeLink}
                                                onChange={handleChange}
                                                className="w-full py-2.5 pl-10 pr-4 text-sm bg-white border outline-none rounded-xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all tracking-wide"
                                                placeholder="https://drive.google.com/... or your portfolio"
                                            />
                                        </div>
                                        <p className="mt-1.5 text-xs text-slate-400">
                                            Please provide a link to your resume (Google Drive, Dropbox, etc.) or your personal portfolio website.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 mt-6 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20"
                                    >
                                        {loading ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                Submit Application <Send size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ApplyJobModal;

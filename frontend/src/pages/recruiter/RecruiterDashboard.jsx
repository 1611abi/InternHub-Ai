import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Briefcase, Building, PlusCircle, Users } from 'lucide-react';

const RecruiterDashboard = () => {
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('jobs');
    
    // UI states
    const [showJobForm, setShowJobForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [companyForm, setCompanyForm] = useState({ companyName: '', industry: '', location: '', website: '', aboutCompany: '' });
    const [jobForm, setJobForm] = useState({ title: '', location: '', stipend: '', duration: '', skills: '', description: '' });

    const handleCompanyChange = (e) => setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
    const handleJobChange = (e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value });

    const handleCreateCompany = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const { data } = await axios.post(`${backendUrl}/recruiter/create-company`, companyForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompany(data);
            alert('Company profile created successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to create company profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            
            // Convert comma separated string to array
            const payload = {
                ...jobForm,
                skillsRequired: jobForm.skills.split(',').map(s => s.trim()).filter(Boolean)
            };

            const { data } = await axios.post(`${backendUrl}/recruiter/post-job`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setJobs([data, ...jobs]);
            setShowJobForm(false);
            setJobForm({ title: '', location: '', stipend: '', duration: '', skills: '', description: '' });
            alert('Job posted successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to post job.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            
            // Try fetching company
            try {
                const compRes = await axios.get(`${backendUrl}/recruiter/company`, config);
                setCompany(compRes.data);
            } catch (err) {
                if (err.response && err.response.status !== 404) console.error(err);
            }

            // Fetch jobs
            const jobsRes = await axios.get(`${backendUrl}/recruiter/my-jobs`, config);
            setJobs(jobsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center pt-32 text-surface-600">Loading dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-surface-900 mb-8">Recruiter Dashboard</h1>
            
            <div className="flex gap-4 mb-8 border-b border-surface-200 pb-4">
                <button 
                    onClick={() => setActiveTab('jobs')}
                    className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'jobs' ? 'text-primary-600' : 'text-surface-500 hover:text-surface-700'}`}
                >
                    <Briefcase size={20} /> My Jobs
                </button>
                <button 
                    onClick={() => setActiveTab('company')}
                    className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'company' ? 'text-primary-600' : 'text-surface-500 hover:text-surface-700'}`}
                >
                    <Building size={20} /> Company Profile
                </button>
            </div>

            <div className="surface p-6 rounded-xl">
                {activeTab === 'jobs' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-surface-900">
                                {showJobForm ? 'Post a New Job' : 'Your Posted Jobs'}
                            </h2>
                            <button 
                                onClick={() => setShowJobForm(!showJobForm)} 
                                className="btn-primary flex items-center gap-2"
                            >
                                <PlusCircle size={18} /> {showJobForm ? 'Cancel' : 'Post New Job'}
                            </button>
                        </div>
                        
                        {showJobForm ? (
                            <form onSubmit={handlePostJob} className="bg-surface-50 p-6 rounded-lg border border-surface-200 space-y-4 max-w-2xl">
                                {!company && (
                                    <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                                        Note: You haven't created a company profile yet. Job will be posted generically.
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 mb-1">Job Title *</label>
                                        <input type="text" name="title" value={jobForm.title} onChange={handleJobChange} required className="input-field py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 mb-1">Location *</label>
                                        <input type="text" name="location" value={jobForm.location} onChange={handleJobChange} required className="input-field py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 mb-1">Stipend / Salary</label>
                                        <input type="text" name="stipend" placeholder="e.g. $1000/mo or Unpaid" value={jobForm.stipend} onChange={handleJobChange} className="input-field py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 mb-1">Duration</label>
                                        <input type="text" name="duration" placeholder="e.g. 3 Months" value={jobForm.duration} onChange={handleJobChange} className="input-field py-2" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-surface-600 mb-1">Skills Required (comma separated)</label>
                                    <input type="text" name="skills" placeholder="React, Node.js, Design" value={jobForm.skills} onChange={handleJobChange} className="input-field py-2" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-surface-600 mb-1">Job Description *</label>
                                    <textarea name="description" value={jobForm.description} onChange={handleJobChange} required rows="5" className="input-field py-2 resize-none"></textarea>
                                </div>

                                <button type="submit" disabled={isSubmitting} className="btn-primary mt-4">
                                    {isSubmitting ? 'Posting...' : 'Post Job'}
                                </button>
                            </form>
                        ) : (
                            <>
                                {jobs.length === 0 ? (
                                    <div className="text-center py-12 text-surface-500 bg-surface-50 border border-surface-200 border-dashed rounded-lg">
                                        <Briefcase size={48} className="mx-auto mb-4 opacity-50 text-surface-400" />
                                        <p>You haven't posted any jobs yet.</p>
                                        <button onClick={() => setShowJobForm(true)} className="text-primary-600 font-medium mt-2 hover:underline">Create your first job</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {jobs.map(job => (
                                            <div key={job._id} className="surface-elevated hover:shadow-card transition-shadow bg-white p-5 rounded-xl flex flex-col h-full">
                                                <div className="mb-4 flex-grow">
                                                    <h3 className="font-semibold text-lg text-surface-900 leading-tight mb-1">{job.title}</h3>
                                                    <p className="text-sm font-medium text-primary-600 mb-3">{job.companyName}</p>
                                                    <div className="space-y-1 text-sm text-surface-600">
                                                        <p>📍 {job.location}</p>
                                                        <p>💰 {job.stipend || 'Unpaid'}</p>
                                                    </div>
                                                </div>
                <div className="pt-4 border-t border-surface-200 mt-auto flex justify-between items-center">
                                                    <span className="text-xs text-surface-400">
                                                        {new Date(job.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <Link to={`/recruiter/applicants/${job._id}`} className="btn-secondary py-1 px-3 text-xs">View Applicants</Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
                
                {activeTab === 'company' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-6 text-surface-900">Company Profile</h2>
                        {company ? (
                            <div className="space-y-3 text-surface-700 bg-surface-50 p-6 rounded-lg border border-surface-200">
                                <p><strong className="text-surface-900">Name:</strong> {company.companyName}</p>
                                <p><strong className="text-surface-900">Industry:</strong> {company.industry}</p>
                                <p><strong className="text-surface-900">Location:</strong> {company.location}</p>
                                <p><strong className="text-surface-900">Website:</strong> {company.website || 'N/A'}</p>
                                <p><strong className="text-surface-900">About:</strong> {company.aboutCompany || 'N/A'}</p>
                                <p><strong className="text-surface-900">Verified:</strong> 
                                    <span className={`ml-2 badge ${company.isVerified ? 'badge-success' : 'bg-yellow-50 text-yellow-700'}`}>
                                        {company.isVerified ? 'Yes' : 'Pending Verification'}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateCompany} className="bg-surface-50 p-6 rounded-lg border border-surface-200 space-y-4 max-w-2xl">
                                <p className="text-surface-600 mb-6 font-medium">Create your company profile to start posting jobs.</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 mb-1">Company Name *</label>
                                        <input type="text" name="companyName" value={companyForm.companyName} onChange={handleCompanyChange} required className="input-field py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 mb-1">Industry *</label>
                                        <input type="text" name="industry" value={companyForm.industry} onChange={handleCompanyChange} required className="input-field py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 mb-1">Location *</label>
                                        <input type="text" name="location" value={companyForm.location} onChange={handleCompanyChange} required className="input-field py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 mb-1">Website URL</label>
                                        <input type="url" name="website" value={companyForm.website} onChange={handleCompanyChange} className="input-field py-2" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-surface-600 mb-1">About Company</label>
                                    <textarea name="aboutCompany" value={companyForm.aboutCompany} onChange={handleCompanyChange} rows="3" className="input-field py-2 resize-none"></textarea>
                                </div>

                                <button type="submit" disabled={isSubmitting} className="btn-primary mt-4">
                                    {isSubmitting ? 'Creating...' : 'Create Company Profile'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterDashboard;

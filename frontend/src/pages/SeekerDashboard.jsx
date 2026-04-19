import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
    FileText, Target, Sparkles, MessageCircle, 
    TrendingUp, CheckCircle, Clock, ArrowRight,
    Search, LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';

const SeekerDashboard = () => {
    const [stats, setStats] = useState({
        resumes: 0,
        skillAnalyses: 0,
        applications: 0
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const backendUrl = import.meta.env.VITE_API_URL || 'https://internhub-ai-dx1i.onrender.com/api';
                
                // Fetch stats from profile
                const { data: profile } = await axios.get(`${backendUrl}/profile`, config);
                setStats({
                    resumes: profile.resumes.length,
                    skillAnalyses: profile.atsReports.length,
                    applications: profile.atsReports.length // For now using this as proxy or fetch actual apps
                });

                // Fetch real applications if available
                try {
                    const { data: apps } = await axios.get(`${backendUrl}/jobs/applications`, config);
                    setRecentApplications(apps.slice(0, 5));
                    setStats(prev => ({ ...prev, applications: apps.length }));
                } catch (e) {
                    console.log("Actual applications not found, using profile data");
                }

            } catch (error) {
                console.error('Error fetching dashboard', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const tools = [
        { 
            title: 'ATS Report', 
            desc: 'Scan resume for compatibility', 
            icon: <FileText className="text-blue-600" />, 
            link: '/ats-score',
            color: 'bg-blue-50'
        },
        { 
            title: 'Skill Gap', 
            desc: 'Find missing requirements', 
            icon: <Target className="text-amber-600" />, 
            link: '/skill-gap',
            color: 'bg-amber-50'
        },
        { 
            title: 'Job Matcher', 
            desc: 'AI recommended roles', 
            icon: <Sparkles className="text-emerald-600" />, 
            link: '/job-recommender',
            color: 'bg-emerald-50'
        },
        { 
            title: 'AI Coach', 
            desc: 'Interactive career guidance', 
            icon: <MessageCircle className="text-violet-600" />, 
            link: '/chat',
            color: 'bg-violet-50'
        }
    ];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-surface-900 flex items-center gap-3">
                    <LayoutDashboard className="text-primary-600" size={28} />
                    Seeker Dashboard
                </h1>
                <p className="text-surface-500 mt-2 text-lg">Track your career progress and leverage AI tools.</p>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: 'Resumes Built', value: stats.resumes, icon: <FileText size={20} />, color: 'text-blue-600' },
                    { label: 'Analyses Run', value: stats.skillAnalyses, icon: <TrendingUp size={20} />, color: 'text-amber-600' },
                    { label: 'Jobs Applied', value: stats.applications, icon: <CheckCircle size={20} />, color: 'text-emerald-600' }
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="surface p-6 flex items-center justify-between border border-surface-200"
                    >
                        <div>
                            <p className="text-sm font-medium text-surface-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-bold text-surface-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-xl bg-surface-50 ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Tools Grid */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center gap-2">
                            <Sparkles className="text-primary-600" size={20} />
                            Your AI Toolbox
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tools.map((tool, i) => (
                                <Link to={tool.link} key={i}>
                                    <motion.div 
                                        whileHover={{ y: -4 }}
                                        className="surface p-6 hover:shadow-card transition-all border border-surface-200 h-full group"
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                            {tool.icon}
                                        </div>
                                        <h3 className="font-bold text-surface-900 mb-1">{tool.title}</h3>
                                        <p className="text-sm text-surface-500">{tool.desc}</p>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-surface-900">Recommended for You</h2>
                            <Link to="/search" className="text-sm font-medium text-primary-600 flex items-center gap-1">
                                Find more <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="surface p-8 text-center border-2 border-dashed border-surface-200 rounded-2xl bg-surface-50">
                            <Search className="mx-auto mb-4 text-surface-300" size={40} />
                            <p className="text-surface-500 mb-6 font-medium">Start a search to see personalized AI matching.</p>
                            <Link to="/search" className="btn-primary">
                                Browse Jobs
                            </Link>
                        </div>
                    </section>
                </div>

                {/* Sidebar: Recent Activity */}
                <div className="space-y-8">
                    <section className="surface p-6 border border-surface-200">
                        <h2 className="text-lg font-bold text-surface-900 mb-6">Recent Applications</h2>
                        {recentApplications.length === 0 ? (
                            <div className="text-center py-10">
                                <Clock className="mx-auto mb-3 text-surface-200" size={32} />
                                <p className="text-sm text-surface-400">No recent applications found.</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {recentApplications.map((app, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-2 h-2 rounded-full bg-primary-600 mt-2"></div>
                                        <div>
                                            <p className="text-sm font-bold text-surface-900 leading-none">{app.jobId?.title || "Role"}</p>
                                            <p className="text-xs text-surface-500 mt-1">{app.jobId?.companyName || "Company"}</p>
                                            <span className={`inline-block mt-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                                app.status === 'shortlisted' ? 'bg-green-50 text-green-600' : 
                                                app.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Link to="/profile" className="mt-8 block text-center text-sm font-medium text-surface-400 hover:text-primary-600 transition-colors">
                            View all history
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SeekerDashboard;

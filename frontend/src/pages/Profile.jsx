import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, FileText, BarChart2, Calendar, Loader2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const backendUrl = import.meta.env.VITE_API_URL || 'https://internhub-ai-dx1i.onrender.com/api';
        const { data } = await axios.get(`${backendUrl}/profile`, config);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={24} className="animate-spin text-surface-400" />
    </div>
  );

  if (!profile) return (
    <div className="p-8 text-center text-red-600">Failed to load profile.</div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="surface p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
              {profile.user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">{profile.user.name}</h1>
              <p className="text-surface-500 text-sm">{profile.user.email}</p>
              <p className="text-surface-400 text-xs mt-1 flex items-center gap-1">
                <Calendar size={12} />
                Member since {new Date(profile.user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button className="btn-secondary text-sm">
            Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: <BarChart2 size={18} className="text-primary-600" />, value: profile.atsReports.length, label: 'ATS Checks' },
          { icon: <FileText size={18} className="text-green-600" />, value: profile.resumes.length, label: 'Resumes Generated' },
          { icon: <BarChart2 size={18} className="text-amber-600" />, value: profile.atsReports.length > 0 ? Math.max(...profile.atsReports.map(r => r.score)) + '%' : '–', label: 'Best ATS Score' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="surface p-5"
          >
            <div className="flex items-center gap-2 mb-3">{stat.icon}<span className="text-xs text-surface-400 uppercase tracking-wider">{stat.label}</span></div>
            <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ATS Reports */}
      <div className="surface p-8 mb-6">
        <h2 className="text-lg font-semibold text-surface-900 mb-6">ATS Check History</h2>
        {profile.atsReports.length === 0 ? (
          <p className="text-surface-400 text-sm">No ATS reports generated yet.</p>
        ) : (
          <div className="space-y-3">
            {profile.atsReports.map(report => (
              <div key={report._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center surface-elevated p-4 hover:border-surface-300 transition-all">
                <div>
                  <p className="text-sm text-surface-900 font-medium">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-surface-400 mt-0.5">
                    Missing: {report.missingSkills.join(', ') || 'None'}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`text-lg font-bold ${report.score >= 70 ? 'text-green-600' : report.score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                    {report.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumes */}
      <div className="surface p-8">
        <h2 className="text-lg font-semibold text-surface-900 mb-6">Generated Resumes</h2>
        {profile.resumes.length === 0 ? (
          <p className="text-surface-400 text-sm">No resumes built yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {profile.resumes.map(resume => (
              <div key={resume._id} className="surface-elevated p-4 flex justify-between items-center hover:border-surface-300 transition-all">
                <span className="text-sm text-surface-600">
                  {new Date(resume.createdAt).toLocaleString()}
                </span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 transition-colors">
                  View <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

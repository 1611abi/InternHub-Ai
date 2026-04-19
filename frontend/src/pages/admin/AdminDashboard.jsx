import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Users, Briefcase, FileText } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recruitersData, setRecruitersData] = useState({ recruiters: [], companies: [] });
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                
                const [statsRes, recruitersRes] = await Promise.all([
                    axios.get(`${backendUrl}/admin/platform-stats`, config),
                    axios.get(`${backendUrl}/admin/recruiters`, config)
                ]);

                setStats(statsRes.data);
                setRecruitersData(recruitersRes.data);
            } catch (error) {
                console.error('Error fetching admin data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleVerify = async (companyId) => {
        try {
            setVerifyingId(companyId);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

            const { data: updatedCompany } = await axios.put(`${backendUrl}/admin/verify-recruiter/${companyId}`, {}, config);
            
            // Update the local state to reflect the verified status immediately
            setRecruitersData(prev => ({
                ...prev,
                companies: prev.companies.map(c => c._id === companyId ? { ...c, isVerified: true } : c)
            }));
            
        } catch (error) {
            console.error('Error verifying recruiter:', error);
            alert('Failed to verify recruiter');
        } finally {
            setVerifyingId(null);
        }
    };

    if (loading) return <div className="p-8 text-center pt-32 text-surface-600">Loading admin data...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-surface-900 mb-8">Admin Dashboard</h1>

            {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                    <div className="surface p-6 rounded-xl flex items-center gap-4 transition-transform hover:scale-[1.02]">
                        <div className="p-4 bg-primary-50 text-primary-600 rounded-lg"><Users size={24} /></div>
                        <div>
                            <p className="text-2xl font-bold text-surface-900">{stats.totalUsers}</p>
                            <p className="text-sm text-surface-500">Total Users</p>
                        </div>
                    </div>
                    <div className="surface p-6 rounded-xl flex items-center gap-4 transition-transform hover:scale-[1.02]">
                        <div className="p-4 bg-green-50 text-green-600 rounded-lg"><Briefcase size={24} /></div>
                        <div>
                            <p className="text-2xl font-bold text-surface-900">{stats.totalInternships}</p>
                            <p className="text-sm text-surface-500">Total Jobs</p>
                        </div>
                    </div>
                    <div className="surface p-6 rounded-xl flex items-center gap-4 transition-transform hover:scale-[1.02]">
                        <div className="p-4 bg-purple-50 text-purple-600 rounded-lg"><Users size={24} /></div>
                        <div>
                            <p className="text-2xl font-bold text-surface-900">{stats.totalRecruiters}</p>
                            <p className="text-sm text-surface-500">Recruiters</p>
                        </div>
                    </div>
                    <div className="surface p-6 rounded-xl flex items-center gap-4 transition-transform hover:scale-[1.02] cursor-pointer" onClick={() => window.location.href = '/careervault/admin'}>
                        <div className="p-4 bg-orange-50 text-orange-600 rounded-lg"><FileText size={24} /></div>
                        <div>
                            <p className="text-2xl font-bold text-surface-900">{stats.pendingResources || 0}</p>
                            <p className="text-sm text-surface-500">Pending Resources</p>
                        </div>
                    </div>
                    <div className="surface p-6 rounded-xl flex items-center gap-4 transition-transform hover:scale-[1.02]">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-lg"><FileText size={24} /></div>
                        <div>
                            <p className="text-2xl font-bold text-surface-900">{stats.totalApplications}</p>
                            <p className="text-sm text-surface-500">Applications</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6 bg-red-50 text-red-600 rounded-xl mb-12 text-center border border-red-100">
                    Failed to load platform statistics. The backend server might be unreachable or returning an error.
                </div>
            )}

            {/* Quick Actions / Recent Activity Preview */}
            <div className="surface p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-surface-900">Recruiter Verification</h2>
                <p className="text-surface-500 mb-6">Review and verify platform recruiters to allow them to post jobs.</p>
                <div className="border border-surface-200 rounded-lg bg-white overflow-x-auto">
                    <table className="w-full text-left text-sm text-surface-600">
                        <thead className="bg-surface-50 border-b border-surface-200 text-surface-700">
                            <tr>
                                <th className="p-4 font-medium">Company Name</th>
                                <th className="p-4 font-medium">Recruiter Email</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-200">
                            {recruitersData.companies.length > 0 ? (
                                recruitersData.companies.map(company => {
                                    // Make sure we have a valid company object before rendering
                                    if (!company) return null;
                                    
                                    // The ID to match with belongs to the user doc. The company profile usually has 'userId'
                                    // We need to find the user document that matches this company.
                                    const recruiter = recruitersData.recruiters.find(r => 
                                        r._id === (company.userId?._id || company.userId)
                                    );
                                    
                                    return (
                                        <tr key={company._id} className="hover:bg-surface-50 transition-colors">
                                            <td className="p-4 font-medium text-surface-900">
                                                {company.companyName || 'Unknown Company'}
                                                {company.website && (
                                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="block text-xs font-normal text-primary-600 hover:underline">
                                                        {company.website}
                                                    </a>
                                                )}
                                            </td>
                                            <td className="p-4">{recruiter?.email || 'N/A'}</td>
                                            <td className="p-4">
                                                {company.isVerified ? (
                                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Verified</span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Pending</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                {!company.isVerified ? (
                                                    <button 
                                                        onClick={() => handleVerify(company._id)}
                                                        disabled={verifyingId === company._id}
                                                        className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors disabled:opacity-50"
                                                    >
                                                        {verifyingId === company._id ? 'Verifying...' : 'Verify'}
                                                    </button>
                                                ) : (
                                                    <span className="text-surface-400 text-xs italic">Approved</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-surface-500">
                                        No recruiters found on the platform yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

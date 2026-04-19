import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const backendUrl = import.meta.env.VITE_API_URL || 'https://internhub-ai-dx1i.onrender.com/api';
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin ? { email, password } : { name, email, password, role };

            const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);
            localStorage.setItem('token', data.token);
            if (data.role) {
                localStorage.setItem('role', data.role);
            }
            
            // Redirect based on role
            const userRole = data.role || 'student';
            if (userRole === 'admin') navigate('/admin/dashboard');
            else if (userRole === 'recruiter') navigate('/recruiter/dashboard');
            else navigate('/dashboard');

        } catch (err) {
            console.error('Authentication Error', err);
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex rounded-2xl overflow-hidden surface border border-surface-200 shadow-sm mx-4 my-4 lg:mx-0">
            {/* Left — Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#F1F5F9] items-center justify-center p-12 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-lg"
                >
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600 mb-12">
                        <Briefcase size={32} />
                        <span>InternHub <span className="text-surface-900">AI</span></span>
                    </Link>

                    <h2 className="text-3xl font-bold text-surface-900 mb-6 leading-tight">
                        Jumpstart your career with AI-powered insights.
                    </h2>
                    <p className="text-surface-500 text-lg mb-8">
                        Join students discovering internships, building resumes, and crushing skill gaps.
                    </p>

                    <div className="space-y-4">
                        {[
                            'Real-time internship discovery across platforms',
                            'AI-powered resume building & tailoring',
                            'Personalized skill gap analysis & roadmaps'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-surface-600">
                                <CheckCircle className="text-primary-600 shrink-0" size={18} />
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right — Form */}
            <div className="w-full lg:w-1/2 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="max-w-md w-full mx-auto"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-surface-900 mb-2">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-surface-500 text-sm">
                            {isLogin
                                ? 'Enter your details to access your dashboard.'
                                : 'Sign up to start accelerating your career.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-surface-600 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-600 mb-1.5">I am a...</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-surface-700 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                value="student" 
                                                className="text-primary-600 focus:ring-primary-500" 
                                                checked={role === 'student'} 
                                                onChange={() => setRole('student')} 
                                            />
                                            Student
                                        </label>
                                        <label className="flex items-center gap-2 text-surface-700 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                value="recruiter" 
                                                className="text-primary-600 focus:ring-primary-500"
                                                checked={role === 'recruiter'} 
                                                onChange={() => setRole('recruiter')} 
                                            />
                                            Recruiter
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-surface-600 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="you@university.edu"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-surface-600">Password</label>
                                {isLogin && (
                                    <a href="#" className="text-xs text-primary-600 hover:text-primary-700">Forgot password?</a>
                                )}
                            </div>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 mt-4 text-sm"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-surface-500 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;

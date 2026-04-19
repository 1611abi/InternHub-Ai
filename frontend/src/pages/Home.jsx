import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, FileText, Target, MessageCircle,
  ArrowRight, Zap, Shield, Star,
  TrendingUp, Users, CheckCircle2, Sparkles,
  MapPin, Building2, Clock, LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
});

const SAMPLE_JOBS = [
  { title: 'Frontend Developer Intern', company: 'Stripe', location: 'Remote', type: 'Full-time', label: 'New' },
  { title: 'Machine Learning Intern', company: 'Google', location: 'Bangalore', type: 'Internship', label: 'Hot' },
  { title: 'Backend Engineer Intern', company: 'GitHub', location: 'Hybrid', type: 'Internship', label: 'Urgent' },
];

const Home = () => {
    const [searchVal, setSearchVal] = useState('');
    const navigate = useNavigate();
    const role = localStorage.getItem('role') || 'student';

    const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/search?domain=${encodeURIComponent(searchVal.trim())}`);
    else navigate('/search');
  };

  return (
    <div className="theme-transition-group">

      {/* ──── Hero ──── */}
      <section className="relative overflow-hidden">
        {/* Subtle grid bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.7 }} />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div {...fadeIn(0)}>
            <div className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-7 shadow-sm">
              <Sparkles size={12} />
              AI-Powered Career Platform for Students
            </div>
          </motion.div>

          <motion.h1 {...fadeIn(1)} className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-5 leading-tight tracking-tight">
            Find Internships.<br />
            <span className="text-blue-600">Build Your Future.</span>
          </motion.h1>

          <motion.p {...fadeIn(2)} className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Real-time job discovery, AI resume builder, skill gap analysis — everything you need to go from campus to career.
          </motion.p>

          {/* Search bar */}
          <motion.form {...fadeIn(3)} onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex bg-white border-2 border-slate-200 rounded-xl shadow-md overflow-hidden focus-within:border-blue-500 transition-all">
              <div className="flex items-center pl-5 text-slate-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search by skill, role, or company..."
                className="flex-1 px-4 py-4 text-base text-slate-800 bg-transparent outline-none"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-7 m-1.5 rounded-lg transition-colors">
                Search
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Trending: <span className="text-slate-600">React</span> · <span className="text-slate-600">Python</span> · <span className="text-slate-600">UI/UX</span> · <span className="text-slate-600">Data Science</span></p>
          </motion.form>

          {/* Mini stats */}
          <motion.div {...fadeIn(4)} className="flex justify-center gap-8 text-center">
            {[
              { value: '10K+', label: 'Live Jobs' },
              { value: '200+', label: 'Companies' },
              { value: '95%', label: 'Match Rate' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──── Live Job Cards preview ──── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">Recently Posted</h2>
          <Link to="/search" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {SAMPLE_JOBS.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                  <Building2 size={18} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${job.label === 'Hot' ? 'bg-orange-50 text-orange-600 border border-orange-200' : job.label === 'Urgent' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                  {job.label}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">{job.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{job.company}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {job.type}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──── 4 Feature tools ──── */}
      <section className="border-t border-slate-200 bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Your Complete Career Toolkit</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Everything from job discovery to offer letter — in one unified AI platform.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: <Search size={22} className="text-blue-600" />,
                bg: 'bg-blue-50',
                title: 'Smart Job Discovery',
                description: 'Real-time scraping across Internshala, LinkedIn, and 20+ portals. Filtered by role, location, and skills.',
                href: '/search',
                cta: 'Search Jobs',
              },
              {
                icon: <FileText size={22} className="text-emerald-600" />,
                bg: 'bg-emerald-50',
                title: 'AI Resume Builder',
                description: 'Choose from 4 professional templates. AI enhances every line to pass ATS scanners instantly.',
                href: '/resume',
                cta: 'Build Resume',
              },
              {
                icon: <Target size={22} className="text-amber-600" />,
                bg: 'bg-amber-50',
                title: 'Skill Gap Analyzer',
                description: 'Upload your resume + paste any JD. Get a precise gap analysis and personalized learning roadmap.',
                href: '/skill-gap',
                cta: 'Analyze Skills',
              },
              {
                icon: <MessageCircle size={22} className="text-violet-600" />,
                bg: 'bg-violet-50',
                title: 'AI Career Coach',
                description: 'Chat with your personal AI mentor. Get interview prep, salary negotiation tips, and career guidance.',
                href: '/chat',
                cta: 'Start Chat',
              },
            ].map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="surface border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-sm transition-all duration-200 group"
              >
                <div className={`w-11 h-11 rounded-xl ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{tool.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{tool.description}</p>
                <Link to={tool.href} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                  {tool.cta} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Why InternHub ──── */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Zap size={20} className="text-blue-600" />, title: 'Live Data', desc: 'Updated every hour from 20+ sources. Never miss a fresh posting.' },
            { icon: <Shield size={20} className="text-emerald-600" />, title: 'ATS Optimized', desc: 'Every template and AI suggestion is built specifically to pass ATS scanners.' },
            { icon: <TrendingUp size={20} className="text-violet-600" />, title: 'Career Progression', desc: 'From intern to full-time — we track your growth and adapt recommendations.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──── CTA Banner ──── */}
      <section className="bg-blue-600 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-5">
            <Star size={22} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Land Your Dream Role?</h2>
          <p className="text-blue-100 mb-8 text-base">Join students who found internships 3× faster with InternHub AI.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {role === 'recruiter' ? (
              <>
                <Link to="/recruiter/dashboard" className="bg-white text-blue-700 font-semibold text-sm px-7 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link to="/search" className="bg-white/10 border border-white/20 text-white font-semibold text-sm px-7 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Search size={16} /> Find Candidates
                </Link>
              </>
            ) : (
              <>
                <Link to="/search" className="bg-white text-blue-700 font-semibold text-sm px-7 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <Search size={16} /> Browse Jobs
                </Link>
                <Link to="/resume" className="bg-white/10 border border-white/20 text-white font-semibold text-sm px-7 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2">
                  <FileText size={16} /> Build Resume
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;

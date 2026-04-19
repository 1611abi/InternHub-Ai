import React, { useState } from 'react';
import { BookOpen, Search, FileCheck, Target, MessageCircle, ArrowLeft, PlayCircle, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Tutorial = () => {
    const [activeTab, setActiveTab] = useState('search');

    const tutorials = {
        search: {
            title: 'Internship Discovery',
            icon: <Search className="text-primary-600" size={20} />,
            description: 'Learn how to find the perfect internship using our real-time aggregator.',
            steps: [
                'Navigate to the Search page from the top menu.',
                'Enter your desired domain (e.g., "Machine Learning" or "Frontend Development").',
                'Click "Search". Our server scrapes the latest postings from Internshala and Indeed.',
                'Browse results and click "View" to open the original posting.'
            ],
        },
        resume: {
            title: 'ATS Resume Builder',
            icon: <FileCheck className="text-green-600" size={20} />,
            description: 'Create a tailored resume designed to pass Applicant Tracking Systems.',
            steps: [
                'Go to the Resume Builder under the Student menu (requires login).',
                'Choose from 4 professional templates: Modern, Minimal, Professional, or Creative.',
                'Fill in your personal details, education, experience, projects, and skills.',
                'Use "Improve with AI" to enhance your summary and bullet points.',
                'Preview your resume in real-time and download as PDF.'
            ],
        },
        skillGap: {
            title: 'Skill Gap Analyzer',
            icon: <Target className="text-amber-600" size={20} />,
            description: 'Identify what you are missing to land your dream role.',
            steps: [
                'Navigate to Skill Gap from the Student menu (requires login).',
                'Upload your current resume (PDF format).',
                'Enter the Job Title or Description you are targeting.',
                'Get an AI-generated roadmap to bridge the gap.'
            ],
        },
        chat: {
            title: 'AI Career Coach',
            icon: <MessageCircle className="text-violet-600" size={20} />,
            description: 'Get instant answers to career and technical questions.',
            steps: [
                'Open the AI Chatbot from the Student menu.',
                'Ask questions like "What projects should I build?" or "How to prepare for interviews?"',
                'The AI understands your query and provides actionable advice.',
                'Your conversations are saved and accessible via the sidebar.'
            ],
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <Link to="/" className="inline-flex items-center gap-2 text-surface-500 hover:text-surface-900 text-sm mb-8 transition-colors">
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row gap-8 items-start mb-10"
            >
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-surface-900 mb-3 flex items-center gap-3">
                        <BookOpen className="text-primary-600" size={28} />
                        How to Use InternHub
                    </h1>
                    <p className="text-surface-500 leading-relaxed">
                        Master the platform to accelerate your career. Our toolset takes you from student to hired professional.
                    </p>
                </div>
                <div className="surface p-5 md:w-72 shrink-0">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-surface-900">
                        <Code size={16} className="text-primary-600" /> Tech Stack
                    </h3>
                    <ul className="space-y-2 text-xs text-surface-500">
                        <li className="flex justify-between border-b border-surface-100 pb-1.5">
                            <span>Frontend</span><span className="font-mono text-primary-600">React + Vite</span>
                        </li>
                        <li className="flex justify-between border-b border-surface-100 pb-1.5">
                            <span>Backend</span><span className="font-mono text-green-600">Node.js</span>
                        </li>
                        <li className="flex justify-between border-b border-surface-100 pb-1.5">
                            <span>Database</span><span className="font-mono text-amber-600">MongoDB</span>
                        </li>
                        <li className="flex justify-between">
                            <span>AI Engine</span><span className="font-mono text-violet-600">Ollama</span>
                        </li>
                    </ul>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-5">
                {/* Sidebar Nav */}
                <div className="lg:col-span-1 space-y-1">
                    {Object.entries(tutorials).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all text-left ${activeTab === key
                                ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-600'
                                : 'text-surface-500 hover:bg-surface-50 hover:text-surface-900 border-l-2 border-transparent'
                                }`}
                        >
                            {data.icon}
                            {data.title}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="surface p-8 md:p-10 min-h-[360px]"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-surface-50 border border-surface-200 flex items-center justify-center">
                                {tutorials[activeTab].icon}
                            </div>
                            <h2 className="text-xl font-bold text-surface-900">{tutorials[activeTab].title}</h2>
                        </div>

                        <p className="text-surface-500 mb-8 pb-6 border-b border-surface-100">
                            {tutorials[activeTab].description}
                        </p>

                        <h3 className="text-sm font-semibold mb-5 flex items-center gap-2 text-surface-400 uppercase tracking-wider">
                            <PlayCircle className="text-primary-600" size={16} /> Step-by-Step
                        </h3>

                        <div className="space-y-4">
                            {tutorials[activeTab].steps.map((step, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="shrink-0 w-7 h-7 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center text-xs font-bold text-primary-600">
                                        {index + 1}
                                    </div>
                                    <p className="text-surface-600 text-sm pt-0.5 leading-relaxed">{step}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Tutorial;

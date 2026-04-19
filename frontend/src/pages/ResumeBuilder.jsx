import React, { useState, useRef } from 'react';
import { ResumeProvider, useResume } from '../features/resume/ResumeContext';
import PersonalInfoForm from '../features/resume/components/PersonalInfoForm';
import SummaryForm from '../features/resume/components/SummaryForm';
import EducationForm from '../features/resume/components/EducationForm';
import ExperienceForm from '../features/resume/components/ExperienceForm';
import ProjectsForm from '../features/resume/components/ProjectsForm';
import SkillsForm from '../features/resume/components/SkillsForm';
import CertificationsForm from '../features/resume/components/CertificationsForm';
import TemplateSelector from '../features/resume/components/TemplateSelector';
import ResumePreview from '../features/resume/components/ResumePreview';
import { exportToPdf } from '../features/resume/pdfExport';
import { FileText, Download, Loader2, ArrowLeft, Eye, Edit3, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeBuilderInner = () => {
    const [mode, setMode] = useState('select'); // 'select' | 'edit'
    const [mobileView, setMobileView] = useState('form'); // 'form' | 'preview'
    const [exporting, setExporting] = useState(false);
    const previewRef = useRef(null);
    const { template, resumeData } = useResume();

    const handleExportPdf = async () => {
        if (!previewRef.current) return;
        setExporting(true);
        try {
            const name = resumeData.personalInfo.fullName || 'resume';
            await exportToPdf(previewRef.current, `${name.replace(/\s+/g, '_')}_resume.pdf`);
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setExporting(false);
        }
    };

    if (mode === 'select') {
        return (
            <div className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
                        <FileText size={20} className="text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900">Resume Builder</h1>
                        <p className="text-surface-500 text-sm">Create a professional, ATS-optimized resume</p>
                    </div>
                </div>

                <TemplateSelector onSelect={() => setMode('edit')} />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-surface-200 bg-white shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMode('select')}
                        className="btn-ghost text-sm px-3 py-1.5"
                    >
                        <ArrowLeft size={14} /> Templates
                    </button>
                    <div className="text-sm font-medium text-surface-500 capitalize flex items-center gap-1.5">
                        <Layout size={14} />
                        {template}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Mobile toggle */}
                    <div className="md:hidden flex items-center bg-surface-100 rounded-lg p-0.5 border border-surface-200">
                        <button
                            onClick={() => setMobileView('form')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mobileView === 'form' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500'}`}
                        >
                            <Edit3 size={12} className="inline mr-1" /> Edit
                        </button>
                        <button
                            onClick={() => setMobileView('preview')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mobileView === 'preview' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500'}`}
                        >
                            <Eye size={12} className="inline mr-1" /> Preview
                        </button>
                    </div>

                    <button
                        onClick={handleExportPdf}
                        disabled={exporting}
                        className="btn-primary text-sm px-4 py-2"
                    >
                        {exporting ? (
                            <><Loader2 size={14} className="animate-spin" /> Exporting...</>
                        ) : (
                            <><Download size={14} /> Download PDF</>
                        )}
                    </button>
                </div>
            </div>

            {/* Main content — split panel */}
            <div className="flex-1 flex overflow-hidden">
                {/* Form panel */}
                <div className={`w-full md:w-1/2 overflow-y-auto p-6 bg-[#F8FAFC] ${mobileView === 'preview' ? 'hidden md:block' : ''}`}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <PersonalInfoForm />
                        <SummaryForm />
                        <ExperienceForm />
                        <EducationForm />
                        <ProjectsForm />
                        <SkillsForm />
                        <CertificationsForm />

                        <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl text-sm text-primary-700">
                            <p className="font-medium mb-1">💡 Auto-save enabled</p>
                            <p className="text-primary-600 text-xs">Your resume data is automatically saved to your browser as you type.</p>
                        </div>
                    </motion.div>
                </div>

                {/* Preview panel */}
                <div className={`w-full md:w-1/2 border-l border-surface-200 bg-surface-100 ${mobileView === 'form' ? 'hidden md:block' : ''}`}>
                    <ResumePreview ref={previewRef} />
                </div>
            </div>
        </div>
    );
};

const ResumeBuilder = () => (
    <ResumeProvider>
        <ResumeBuilderInner />
    </ResumeProvider>
);

export default ResumeBuilder;

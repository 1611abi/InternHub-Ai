import React, { useState } from 'react';
import { useResume } from '../ResumeContext';
import { AlignLeft, Wand2, Loader2 } from 'lucide-react';
import ResumeSection from './ResumeSection';

const SummaryForm = () => {
    const { resumeData, updateSummary } = useResume();
    const [aiLoading, setAiLoading] = useState(false);

    const handleAIImprove = async () => {
        if (!resumeData.summary.trim()) return;
        setAiLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            const res = await fetch(`${backendUrl}/resume/ai-enhance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ section: 'summary', text: resumeData.summary }),
            });
            const data = await res.json();
            if (data.improved) updateSummary(data.improved);
        } catch (err) {
            console.error('AI enhancement failed:', err);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <ResumeSection title="Professional Summary" icon={<AlignLeft size={16} />} defaultOpen={true}>
            <div className="space-y-3">
                <textarea
                    className="input-field h-28 resize-none"
                    placeholder="Write a brief professional summary highlighting your key strengths and career objectives..."
                    value={resumeData.summary}
                    onChange={(e) => updateSummary(e.target.value)}
                />
                <div className="flex items-center justify-between">
                    <span className="text-xs text-surface-400">{resumeData.summary.length} characters</span>
                    <button
                        onClick={handleAIImprove}
                        disabled={aiLoading || !resumeData.summary.trim()}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50"
                    >
                        {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
                        Improve with AI
                    </button>
                </div>
            </div>
        </ResumeSection>
    );
};

export default SummaryForm;

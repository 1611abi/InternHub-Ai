import React, { useState } from 'react';
import { useResume } from '../ResumeContext';
import { Briefcase, Trash2, Plus, X, Wand2, Loader2 } from 'lucide-react';
import ResumeSection from './ResumeSection';

const ExperienceForm = () => {
    const { resumeData, updateEntry, addEntry, removeEntry, addBullet, updateBullet, removeBullet } = useResume();
    const entries = resumeData.experience;
    const [aiLoadingBullet, setAiLoadingBullet] = useState(null);

    const handleAdd = () => {
        addEntry('experience', { company: '', position: '', startDate: '', endDate: '', current: false, bullets: [''] });
    };

    const handleAIBullet = async (entryId, bulletIndex, text) => {
        if (!text.trim()) return;
        const key = `${entryId}-${bulletIndex}`;
        setAiLoadingBullet(key);
        try {
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            const res = await fetch(`${backendUrl}/resume/ai-enhance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ section: 'experience_bullet', text }),
            });
            const data = await res.json();
            if (data.improved) updateBullet('experience', entryId, bulletIndex, data.improved);
        } catch (err) {
            console.error('AI enhancement failed:', err);
        } finally {
            setAiLoadingBullet(null);
        }
    };

    return (
        <ResumeSection title="Work Experience" icon={<Briefcase size={16} />} onAdd={handleAdd} addLabel="Add Experience">
            <div className="space-y-5">
                {entries.map((exp) => (
                    <div key={exp.id} className="relative bg-surface-50 border border-surface-200 rounded-xl p-4">
                        {entries.length > 1 && (
                            <button
                                onClick={() => removeEntry('experience', exp.id)}
                                className="absolute top-3 right-3 text-surface-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Company</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="Company Name" value={exp.company} onChange={(e) => updateEntry('experience', exp.id, 'company', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Position</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="Software Engineer" value={exp.position} onChange={(e) => updateEntry('experience', exp.id, 'position', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Start Date</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="Jan 2023" value={exp.startDate} onChange={(e) => updateEntry('experience', exp.id, 'startDate', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">End Date</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="input-field text-sm py-2 flex-1"
                                        placeholder={exp.current ? 'Present' : 'Dec 2023'}
                                        value={exp.current ? 'Present' : exp.endDate}
                                        disabled={exp.current}
                                        onChange={(e) => updateEntry('experience', exp.id, 'endDate', e.target.value)}
                                    />
                                    <label className="flex items-center gap-1.5 text-xs text-surface-500 whitespace-nowrap cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={exp.current}
                                            onChange={(e) => updateEntry('experience', exp.id, 'current', e.target.checked)}
                                            className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        Current
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Bullets */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-surface-500">Accomplishments</label>
                            {exp.bullets.map((bullet, bIdx) => (
                                <div key={bIdx} className="flex items-start gap-2">
                                    <span className="text-surface-400 text-xs mt-2.5">•</span>
                                    <input
                                        type="text"
                                        className="input-field text-sm py-2 flex-1"
                                        placeholder="Describe an accomplishment..."
                                        value={bullet}
                                        onChange={(e) => updateBullet('experience', exp.id, bIdx, e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleAIBullet(exp.id, bIdx, bullet)}
                                        disabled={aiLoadingBullet === `${exp.id}-${bIdx}` || !bullet.trim()}
                                        className="mt-1.5 text-primary-500 hover:text-primary-600 disabled:opacity-40 transition-colors"
                                        title="Improve with AI"
                                    >
                                        {aiLoadingBullet === `${exp.id}-${bIdx}` ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
                                    </button>
                                    {exp.bullets.length > 1 && (
                                        <button
                                            onClick={() => removeBullet('experience', exp.id, bIdx)}
                                            className="mt-1.5 text-surface-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={13} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={() => addBullet('experience', exp.id)}
                                className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors flex items-center gap-1"
                            >
                                <Plus size={12} /> Add bullet
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ResumeSection>
    );
};

export default ExperienceForm;

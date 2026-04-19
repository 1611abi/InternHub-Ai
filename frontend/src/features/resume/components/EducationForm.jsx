import React from 'react';
import { useResume } from '../ResumeContext';
import { GraduationCap, Trash2 } from 'lucide-react';
import ResumeSection from './ResumeSection';

const EducationForm = () => {
    const { resumeData, updateEntry, addEntry, removeEntry } = useResume();
    const entries = resumeData.education;

    const handleAdd = () => {
        addEntry('education', { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' });
    };

    return (
        <ResumeSection title="Education" icon={<GraduationCap size={16} />} onAdd={handleAdd} addLabel="Add Education">
            <div className="space-y-5">
                {entries.map((edu, idx) => (
                    <div key={edu.id} className="relative bg-surface-50 border border-surface-200 rounded-xl p-4">
                        {entries.length > 1 && (
                            <button
                                onClick={() => removeEntry('education', edu.id)}
                                className="absolute top-3 right-3 text-surface-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-surface-500 mb-1">Institution</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="University Name" value={edu.institution} onChange={(e) => updateEntry('education', edu.id, 'institution', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Degree</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="B.S." value={edu.degree} onChange={(e) => updateEntry('education', edu.id, 'degree', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Field of Study</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="Computer Science" value={edu.field} onChange={(e) => updateEntry('education', edu.id, 'field', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Start Date</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="Aug 2020" value={edu.startDate} onChange={(e) => updateEntry('education', edu.id, 'startDate', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">End Date</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="May 2024" value={edu.endDate} onChange={(e) => updateEntry('education', edu.id, 'endDate', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">GPA (optional)</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="3.8/4.0" value={edu.gpa} onChange={(e) => updateEntry('education', edu.id, 'gpa', e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ResumeSection>
    );
};

export default EducationForm;

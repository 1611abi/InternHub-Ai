import React, { useState } from 'react';
import { useResume } from '../ResumeContext';
import { Layers, X } from 'lucide-react';
import ResumeSection from './ResumeSection';

const SkillsForm = () => {
    const { resumeData, updateSkills } = useResume();
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!resumeData.skills.includes(inputValue.trim())) {
                updateSkills([...resumeData.skills, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const removeSkill = (skill) => {
        updateSkills(resumeData.skills.filter((s) => s !== skill));
    };

    return (
        <ResumeSection title="Skills" icon={<Layers size={16} />}>
            <div className="space-y-3">
                <div>
                    <input
                        type="text"
                        className="input-field text-sm py-2"
                        placeholder="Type a skill and press Enter..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {resumeData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill) => (
                            <span
                                key={skill}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-200"
                            >
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {resumeData.skills.length === 0 && (
                    <p className="text-xs text-surface-400">No skills added yet. Type and press Enter to add.</p>
                )}
            </div>
        </ResumeSection>
    );
};

export default SkillsForm;

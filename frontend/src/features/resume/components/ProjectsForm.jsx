import React from 'react';
import { useResume } from '../ResumeContext';
import { FolderKanban, Trash2 } from 'lucide-react';
import ResumeSection from './ResumeSection';

const ProjectsForm = () => {
    const { resumeData, updateEntry, addEntry, removeEntry } = useResume();
    const entries = resumeData.projects;

    const handleAdd = () => {
        addEntry('projects', { name: '', description: '', technologies: '', link: '' });
    };

    return (
        <ResumeSection title="Projects" icon={<FolderKanban size={16} />} onAdd={handleAdd} addLabel="Add Project">
            <div className="space-y-5">
                {entries.map((proj) => (
                    <div key={proj.id} className="relative bg-surface-50 border border-surface-200 rounded-xl p-4">
                        {entries.length > 1 && (
                            <button
                                onClick={() => removeEntry('projects', proj.id)}
                                className="absolute top-3 right-3 text-surface-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Project Name</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="My Cool Project" value={proj.name} onChange={(e) => updateEntry('projects', proj.id, 'name', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Technologies</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="React, Node.js, MongoDB" value={proj.technologies} onChange={(e) => updateEntry('projects', proj.id, 'technologies', e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-surface-500 mb-1">Description</label>
                                <textarea className="input-field text-sm py-2 resize-none h-16" placeholder="Brief description of the project..." value={proj.description} onChange={(e) => updateEntry('projects', proj.id, 'description', e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-surface-500 mb-1">Link (optional)</label>
                                <input type="url" className="input-field text-sm py-2" placeholder="https://github.com/..." value={proj.link} onChange={(e) => updateEntry('projects', proj.id, 'link', e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ResumeSection>
    );
};

export default ProjectsForm;

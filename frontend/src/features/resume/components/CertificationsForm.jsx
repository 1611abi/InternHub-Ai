import React from 'react';
import { useResume } from '../ResumeContext';
import { Award, Trash2 } from 'lucide-react';
import ResumeSection from './ResumeSection';

const CertificationsForm = () => {
    const { resumeData, updateEntry, addEntry, removeEntry } = useResume();
    const entries = resumeData.certifications;

    const handleAdd = () => {
        addEntry('certifications', { name: '', issuer: '', date: '', link: '' });
    };

    return (
        <ResumeSection title="Certifications" icon={<Award size={16} />} onAdd={handleAdd} addLabel="Add Certification" defaultOpen={false}>
            <div className="space-y-5">
                {entries.map((cert) => (
                    <div key={cert.id} className="relative bg-surface-50 border border-surface-200 rounded-xl p-4">
                        {entries.length > 1 && (
                            <button
                                onClick={() => removeEntry('certifications', cert.id)}
                                className="absolute top-3 right-3 text-surface-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Certification Name</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="AWS Cloud Practitioner" value={cert.name} onChange={(e) => updateEntry('certifications', cert.id, 'name', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Issuer</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="Amazon Web Services" value={cert.issuer} onChange={(e) => updateEntry('certifications', cert.id, 'issuer', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Date</label>
                                <input type="text" className="input-field text-sm py-2" placeholder="Dec 2023" value={cert.date} onChange={(e) => updateEntry('certifications', cert.id, 'date', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-500 mb-1">Link (optional)</label>
                                <input type="url" className="input-field text-sm py-2" placeholder="https://..." value={cert.link} onChange={(e) => updateEntry('certifications', cert.id, 'link', e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ResumeSection>
    );
};

export default CertificationsForm;

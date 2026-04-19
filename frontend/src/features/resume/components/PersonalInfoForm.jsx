import React from 'react';
import { useResume } from '../ResumeContext';
import { User } from 'lucide-react';
import ResumeSection from './ResumeSection';

const PersonalInfoForm = () => {
    const { resumeData, updatePersonal } = useResume();
    const info = resumeData.personalInfo;

    const handleChange = (field) => (e) => {
        updatePersonal({ [field]: e.target.value });
    };

    return (
        <ResumeSection title="Personal Information" icon={<User size={16} />} defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-surface-600 mb-1.5">Full Name</label>
                    <input type="text" className="input-field" placeholder="John Doe" value={info.fullName} onChange={handleChange('fullName')} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-surface-600 mb-1.5">Email</label>
                    <input type="email" className="input-field" placeholder="john@example.com" value={info.email} onChange={handleChange('email')} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-surface-600 mb-1.5">Phone</label>
                    <input type="tel" className="input-field" placeholder="+1 (555) 000-0000" value={info.phone} onChange={handleChange('phone')} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-surface-600 mb-1.5">Location</label>
                    <input type="text" className="input-field" placeholder="San Francisco, CA" value={info.location} onChange={handleChange('location')} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-surface-600 mb-1.5">LinkedIn</label>
                    <input type="url" className="input-field" placeholder="linkedin.com/in/johndoe" value={info.linkedin} onChange={handleChange('linkedin')} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-surface-600 mb-1.5">Portfolio</label>
                    <input type="url" className="input-field" placeholder="johndoe.dev" value={info.portfolio} onChange={handleChange('portfolio')} />
                </div>
            </div>
        </ResumeSection>
    );
};

export default PersonalInfoForm;

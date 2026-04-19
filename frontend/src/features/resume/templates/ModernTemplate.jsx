import React from 'react';
import ResumeLayoutEngine from '../components/ResumeLayoutEngine';

const ModernTemplate = ({ data }) => {
    return (
        <ResumeLayoutEngine
            data={data}
            config={{
                templateStyle: 'modern',
                accentColor: 'text-blue-600',
                accentBg: 'bg-blue-500',
                borderColor: 'border-slate-200', // Modern uses inline flex dividers instead of border bottom
                headerAlignment: 'left'
            }}
        />
    );
};

export default ModernTemplate;

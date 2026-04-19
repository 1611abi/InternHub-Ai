import React from 'react';
import ResumeLayoutEngine from '../components/ResumeLayoutEngine';

const ProfessionalTemplate = ({ data }) => {
    return (
        <ResumeLayoutEngine
            data={data}
            config={{
                templateStyle: 'professional',
                showSidebar: true,
                accentColor: 'text-slate-900',
                borderColor: 'border-slate-300',
                headerAlignment: 'left'
            }}
        />
    );
};

export default ProfessionalTemplate;

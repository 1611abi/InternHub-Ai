import React from 'react';
import ResumeLayoutEngine from '../components/ResumeLayoutEngine';

const CreativeTemplate = ({ data }) => {
    return (
        <ResumeLayoutEngine
            data={data}
            config={{
                templateStyle: 'creative',
                accentColor: 'text-teal-700',
                accentBg: 'bg-teal-500',
                borderColor: 'border-teal-200',
                headerAlignment: 'left'
            }}
        />
    );
};

export default CreativeTemplate;

import React from 'react';
import ResumeLayoutEngine from '../components/ResumeLayoutEngine';

const MinimalTemplate = ({ data }) => {
    return (
        <ResumeLayoutEngine
            data={data}
            config={{
                templateStyle: 'minimal',
                accentColor: 'text-slate-900',
                borderColor: 'border-slate-200',
                headerAlignment: 'center'
            }}
        />
    );
};

export default MinimalTemplate;

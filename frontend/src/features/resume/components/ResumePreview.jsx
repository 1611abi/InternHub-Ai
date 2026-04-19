import React, { forwardRef } from 'react';
import { useResume } from '../ResumeContext';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';

const templateMap = {
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    professional: ProfessionalTemplate,
    creative: CreativeTemplate,
};

const ResumePreview = forwardRef((props, ref) => {
    const { resumeData, template } = useResume();
    const TemplateComponent = templateMap[template] || ModernTemplate;

    return (
        <div className="h-full bg-surface-100 rounded-xl overflow-auto p-6 flex justify-center">
            <div
                ref={ref}
                className="shadow-md flex-shrink-0"
                style={{
                    transform: 'scale(0.65)',
                    transformOrigin: 'top center',
                    width: '210mm',
                    minHeight: '297mm',
                }}
            >
                <TemplateComponent data={resumeData} />
            </div>
        </div>
    );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;

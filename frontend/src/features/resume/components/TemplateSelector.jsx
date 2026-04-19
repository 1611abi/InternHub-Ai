import React from 'react';
import { useResume } from '../ResumeContext';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const templates = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Blue accents with clean section headers',
        preview: 'bg-white border-t-4 border-blue-600',
        accent: '#2563eb',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Maximum whitespace, centered layout',
        preview: 'bg-white',
        accent: '#0f172a',
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Two-column with dark sidebar',
        preview: 'bg-white flex',
        accent: '#0f172a',
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Teal accents with visual skill tags',
        preview: 'bg-white border-l-4 border-teal-500',
        accent: '#0d9488',
    },
];

const TemplateSelector = ({ onSelect }) => {
    const { template, setTemplate } = useResume();

    const handleSelect = (id) => {
        setTemplate(id);
        if (onSelect) onSelect(id);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-surface-900 mb-2">Choose a Template</h2>
                <p className="text-surface-500">Select a professional template for your resume. You can switch anytime.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {templates.map((tmpl, i) => (
                    <motion.button
                        key={tmpl.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        onClick={() => handleSelect(tmpl.id)}
                        className={`relative group text-left rounded-xl border-2 transition-all duration-200 overflow-hidden ${template === tmpl.id
                                ? 'border-primary-600 shadow-md'
                                : 'border-surface-200 hover:border-surface-300 hover:shadow-sm'
                            }`}
                    >
                        {/* Template preview thumbnail */}
                        <div className="aspect-[3/4] bg-surface-50 p-3 flex items-start justify-center">
                            <div className={`w-full h-full rounded-lg shadow-sm overflow-hidden ${tmpl.preview}`} style={{ fontSize: '4px', padding: '6px' }}>
                                {tmpl.id === 'professional' ? (
                                    <>
                                        <div style={{ width: '30%', height: '100%', backgroundColor: '#0f172a', float: 'left', borderRadius: '2px' }} />
                                        <div style={{ marginLeft: '34%' }}>
                                            <div style={{ height: '3px', backgroundColor: '#e2e8f0', marginBottom: '3px', width: '80%' }} />
                                            <div style={{ height: '2px', backgroundColor: '#f1f5f9', marginBottom: '2px', width: '60%' }} />
                                            <div style={{ height: '2px', backgroundColor: '#f1f5f9', marginBottom: '2px', width: '70%' }} />
                                            <div style={{ height: '2px', backgroundColor: '#f1f5f9', marginBottom: '4px', width: '50%' }} />
                                            <div style={{ height: '3px', backgroundColor: '#e2e8f0', marginBottom: '3px', width: '60%' }} />
                                            <div style={{ height: '2px', backgroundColor: '#f1f5f9', marginBottom: '2px', width: '80%' }} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ height: '4px', backgroundColor: tmpl.accent, marginBottom: '4px', width: tmpl.id === 'minimal' ? '40%' : '60%', marginLeft: tmpl.id === 'minimal' ? 'auto' : 0, marginRight: tmpl.id === 'minimal' ? 'auto' : 0, borderRadius: '1px' }} />
                                        <div style={{ height: '2px', backgroundColor: '#e2e8f0', marginBottom: '2px', width: '80%', marginLeft: tmpl.id === 'minimal' ? 'auto' : 0, marginRight: tmpl.id === 'minimal' ? 'auto' : 0 }} />
                                        <div style={{ height: '2px', backgroundColor: '#f1f5f9', marginBottom: '4px', width: '50%', marginLeft: tmpl.id === 'minimal' ? 'auto' : 0, marginRight: tmpl.id === 'minimal' ? 'auto' : 0 }} />
                                        <div style={{ height: '3px', backgroundColor: tmpl.accent + '40', marginBottom: '3px', width: '40%', borderRadius: '1px' }} />
                                        <div style={{ height: '2px', backgroundColor: '#f1f5f9', marginBottom: '2px', width: '90%' }} />
                                        <div style={{ height: '2px', backgroundColor: '#f1f5f9', marginBottom: '2px', width: '70%' }} />
                                        <div style={{ height: '2px', backgroundColor: '#f1f5f9', marginBottom: '4px', width: '80%' }} />
                                        <div style={{ height: '3px', backgroundColor: tmpl.accent + '40', marginBottom: '3px', width: '35%', borderRadius: '1px' }} />
                                        <div style={{ height: '2px', backgroundColor: '#f1f5f9', marginBottom: '2px', width: '85%' }} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Label */}
                        <div className="px-4 py-3 border-t border-surface-100">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-surface-900">{tmpl.name}</span>
                                {template === tmpl.id && (
                                    <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                                        <Check size={12} className="text-white" />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-surface-500 mt-0.5">{tmpl.description}</p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;

import React from 'react';

// Unified Layout Engine for ATS-Optimized Resumes
// Supports A4 size, semantic HTML structure, proper hierarchy, and Tailwind typography
const ResumeLayoutEngine = ({ data, config }) => {
    const { personalInfo, summary, education, experience, projects, skills, certifications } = data;

    // Core Config Options
    const {
        templateStyle = 'modern', // modern, minimal, professional, creative
        density = 'standard',      // compact, standard, spacious
        pageSize = 'A4',           // A4, Letter
        accentColor = 'text-blue-600',
        borderColor = 'border-blue-200',
        headerAlignment = 'left',
        showSidebar = false
    } = config || {};

    // Density Spacing Mappings (8px scale)
    const spacing = {
        compact: { section: 'mb-4', item: 'mb-2', header: 'pb-1' },
        standard: { section: 'mb-6', item: 'mb-4', header: 'pb-2' },
        spacious: { section: 'mb-8', item: 'mb-5', header: 'pb-3' },
    };

    const sp = spacing[density] || spacing.standard;

    // Typography global scale (applied via Tailwind classes)
    const typography = {
        h1: `text-[24px] font-bold text-slate-900 leading-tight tracking-tight ${headerAlignment === 'center' ? 'text-center' : ''}`,
        h2: `text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-3 ${sp.header} border-b ${borderColor} flex items-center gap-2`,
        h3: 'text-[14px] font-semibold text-slate-800',
        org: 'text-[13px] font-medium text-slate-600',
        dates: 'text-[11px] text-slate-500 whitespace-nowrap',
        body: 'text-[11.5px] text-slate-600 leading-[1.6]',
        bullet: 'bg-slate-300 w-[4px] h-[4px] rounded-full inline-block mr-2 shrink-0 mt-1.5'
    };

    // Component abstractions for semantic structure
    const SectionHeader = ({ children }) => (
        <h2 className={typography.h2}>
            {templateStyle === 'creative' && <span className={`w-1 h-3 rounded-full ${config.accentBg || 'bg-teal-500'}`}></span>}
            {children}
            {templateStyle === 'modern' && <div className={`flex-1 h-px ${config.accentBg || 'bg-blue-500'} opacity-20 ml-2`}></div>}
            {templateStyle === 'minimal' && headerAlignment === 'center' && <div className="flex-1 h-px bg-slate-200 ml-2"></div>}
        </h2>
    );

    // Page wrapper ensuring print-safe A4/Letter size constraint
    const pageStyle = {
        width: pageSize === 'Letter' ? '8.5in' : '210mm',
        minHeight: pageSize === 'Letter' ? '11in' : '297mm',
        backgroundColor: '#ffffff',
    };

    return (
        <div
            style={pageStyle}
            className={`mx-auto bg-white overflow-hidden text-slate-800 ${templateStyle === 'professional' && showSidebar ? 'flex' : 'p-[20mm]'}`}
        >
            {/* ── LEFT SIDEBAR (Professional Only) ── */}
            {templateStyle === 'professional' && showSidebar && (
                <div className="w-[30%] bg-slate-900 text-slate-300 p-[12mm] shrink-0 border-r border-slate-800">
                    <h1 className="text-[20px] font-bold text-white mb-6 leading-tight tracking-tight">
                        {personalInfo.fullName || 'Your Name'}
                    </h1>

                    <div className={sp.section}>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-2 mb-3">Contact</h2>
                        <div className="flex flex-col gap-2 text-[11px]">
                            {personalInfo.email && <div className="break-all"><span className="text-slate-500 block text-[9.5px]">Email</span>{personalInfo.email}</div>}
                            {personalInfo.phone && <div><span className="text-slate-500 block text-[9.5px]">Phone</span>{personalInfo.phone}</div>}
                            {personalInfo.location && <div><span className="text-slate-500 block text-[9.5px]">Location</span>{personalInfo.location}</div>}
                            {personalInfo.linkedin && <div className="break-all"><span className="text-slate-500 block text-[9.5px]">LinkedIn</span>{personalInfo.linkedin}</div>}
                            {personalInfo.portfolio && <div className="break-all"><span className="text-slate-500 block text-[9.5px]">Portfolio</span>{personalInfo.portfolio}</div>}
                        </div>
                    </div>

                    {education.some(e => e.institution) && (
                        <div className={sp.section}>
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-2 mb-3">Education</h2>
                            {education.filter(e => e.institution).map(edu => (
                                <div key={edu.id} className="mb-3">
                                    <div className="text-[12px] font-semibold text-white leading-tight">{edu.degree}</div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">{edu.institution}</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">{edu.startDate} – {edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {skills.length > 0 && (
                        <div className={sp.section}>
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-2 mb-3">Skills</h2>
                            <div className="flex flex-wrap gap-1.5">
                                {skills.map((skill, i) => (
                                    <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── MAIN CONTENT ── */}
            <div className={templateStyle === 'professional' && showSidebar ? 'w-[70%] p-[12mm] pl-[16mm]' : 'w-full'}>

                {/* Header (If no sidebar or not professional) */}
                {!(templateStyle === 'professional' && showSidebar) && (
                    <header className={`mb-8 ${headerAlignment === 'center' ? 'text-center border-b-0' : `border-b-[2px] ${borderColor} pb-4`}`}>
                        <h1 className={typography.h1}>{personalInfo.fullName || 'Your Name'}</h1>
                        <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-2 ${typography.body} text-slate-500 ${headerAlignment === 'center' ? 'justify-center' : ''}`}>
                            {personalInfo.email && <span>{personalInfo.email}</span>}
                            {personalInfo.phone && <span>{personalInfo.phone}</span>}
                            {personalInfo.location && <span>{personalInfo.location}</span>}
                            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                            {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
                        </div>
                    </header>
                )}

                {/* Summary */}
                {summary && (
                    <section className={sp.section}>
                        <SectionHeader>Professional Summary</SectionHeader>
                        <p className={typography.body}>{summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience.some(e => e.company || e.position) && (
                    <section className={sp.section}>
                        <SectionHeader>Experience</SectionHeader>
                        <div className="flex flex-col gap-4">
                            {experience.filter(e => e.company || e.position).map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={typography.h3}>
                                            {exp.position}
                                            {exp.company && <span className={`${templateStyle === 'modern' ? accentColor : 'text-slate-600'} font-medium ml-1.5`}>
                                                @ {exp.company}
                                            </span>}
                                        </h3>
                                        <span className={typography.dates}>
                                            {exp.startDate}{(exp.endDate || exp.current) ? ` – ${exp.current ? 'Present' : exp.endDate}` : ''}
                                        </span>
                                    </div>
                                    {exp.bullets.filter(b => b.trim()).length > 0 && (
                                        <ul className="mt-2 space-y-1.5 pl-1.5">
                                            {exp.bullets.filter(b => b.trim()).map((b, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className={typography.bullet}></span>
                                                    <span className={typography.body}>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education (If not in sidebar) */}
                {!(templateStyle === 'professional' && showSidebar) && education.some(e => e.institution) && (
                    <section className={sp.section}>
                        <SectionHeader>Education</SectionHeader>
                        <div className="flex flex-col gap-3">
                            {education.filter(e => e.institution).map(edu => (
                                <div key={edu.id} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className={typography.h3}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</h3>
                                        <div className={typography.org}>{edu.institution}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                                    </div>
                                    <span className={typography.dates}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects.some(p => p.name) && (
                    <section className={sp.section}>
                        <SectionHeader>Projects</SectionHeader>
                        <div className="flex flex-col gap-4">
                            {projects.filter(p => p.name).map(proj => (
                                <div key={proj.id}>
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={typography.h3}>{proj.name}</h3>
                                        {proj.technologies && <span className="text-[10.5px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{proj.technologies}</span>}
                                    </div>
                                    {proj.description && <p className={`${typography.body} text-slate-600 mt-1`}>{proj.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills (If not in sidebar) */}
                {!(templateStyle === 'professional' && showSidebar) && skills.length > 0 && (
                    <section className={sp.section}>
                        <SectionHeader>Skills</SectionHeader>

                        {/* Render inline or as tag depending on template */}
                        {templateStyle === 'minimal' ? (
                            <div className={`${typography.body} font-medium tracking-wide`}>
                                {skills.join('  ·  ')}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-1.5">
                                {skills.map((skill, i) => (
                                    <span key={i} className={`text-[11px] font-medium px-2.5 py-1 ${templateStyle === 'creative' ? 'bg-teal-50 text-teal-700 rounded-full border border-teal-100' : 'bg-blue-50 text-blue-700 rounded border border-blue-100'}`}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Certifications */}
                {certifications.some(c => c.name) && (
                    <section className={sp.section}>
                        <SectionHeader>Certifications</SectionHeader>
                        <div className="flex flex-col gap-2">
                            {certifications.filter(c => c.name).map(cert => (
                                <div key={cert.id} className="flex justify-between items-baseline">
                                    <h3 className={typography.h3}>{cert.name} <span className="text-slate-400 text-[12px] ml-1 font-normal">· {cert.issuer}</span></h3>
                                    <span className={typography.dates}>{cert.date}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
};

export default ResumeLayoutEngine;

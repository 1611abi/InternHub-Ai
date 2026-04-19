// Default resume data structure
export const defaultResumeData = {
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
    },
    summary: '',
    education: [
        {
            id: crypto.randomUUID(),
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            gpa: '',
        },
    ],
    experience: [
        {
            id: crypto.randomUUID(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            bullets: [''],
        },
    ],
    projects: [
        {
            id: crypto.randomUUID(),
            name: '',
            description: '',
            technologies: '',
            link: '',
        },
    ],
    skills: [],
    certifications: [
        {
            id: crypto.randomUUID(),
            name: '',
            issuer: '',
            date: '',
            link: '',
        },
    ],
};

export const sectionLabels = {
    personalInfo: 'Personal Information',
    summary: 'Professional Summary',
    education: 'Education',
    experience: 'Work Experience',
    projects: 'Projects',
    skills: 'Skills',
    certifications: 'Certifications',
};

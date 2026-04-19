const resumeBuilderService = require('../services/resumeBuilderService');
const Resume = require('../models/Resume');

const createTemplateResume = async (req, res) => {
    try {
        const { resumeData } = req.body;
        if (!resumeData) return res.status(400).json({ message: 'Resume data required' });

        const filePath = await resumeBuilderService.generateTemplateResume(req.user._id, resumeData);

        const resume = await Resume.create({
            userId: req.user._id,
            filePath
        });

        res.status(201).json(resume);
    } catch (error) {
        console.error('Error creating template resume:', error);
        res.status(500).json({ message: 'Error generating resume' });
    }
};

const createAIResume = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;
        if (!resumeData || !jobDescription) return res.status(400).json({ message: 'Resume data and job description required' });

        const filePath = await resumeBuilderService.generateAIResume(req.user._id, resumeData, jobDescription);

        const resume = await Resume.create({
            userId: req.user._id,
            filePath
        });

        res.status(201).json(resume);
    } catch (error) {
        console.error('Error creating AI resume:', error);
        res.status(500).json({ message: 'Error generating AI resume' });
    }
};

const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resumes' });
    }
};

const aiEnhance = async (req, res) => {
    try {
        const { section, text } = req.body;
        if (!text) return res.status(400).json({ message: 'Text is required' });

        // Stub: returns improved text. Replace with OpenAI integration in production.
        const improvements = {
            summary: `Results-driven professional with expertise in ${text.split(' ').slice(0, 3).join(' ')}. Proven track record of delivering impactful solutions and driving measurable outcomes in fast-paced environments.`,
            experience_bullet: `Spearheaded ${text.toLowerCase()}, resulting in measurable improvements to team productivity and project delivery timelines.`,
        };

        const improved = improvements[section] || `Enhanced: ${text}`;
        res.json({ improved, original: text });
    } catch (error) {
        console.error('AI enhancement error:', error);
        res.status(500).json({ message: 'AI enhancement failed' });
    }
};

const exportPdf = async (req, res) => {
    // Stub: PDF generation handled client-side via html2pdf.js
    // In production, integrate Puppeteer here for server-side rendering
    res.json({ message: 'PDF export is handled client-side. This endpoint is reserved for future server-side generation.' });
};

module.exports = {
    createTemplateResume,
    createAIResume,
    getUserResumes,
    aiEnhance,
    exportPdf
};

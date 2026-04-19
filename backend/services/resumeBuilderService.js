const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');

// Mock generation for template-based resume
const generateTemplateResume = async (userId, resumeData) => {
    // In a real app, this would use a library like html-pdf or puppeteer
    // to generate a PDF from resumeData. For now, we mock it.
    console.log(`Generating template resume for user ${userId}`);
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    const mockFilePath = path.join('uploads', `resume_${userId}_${Date.now()}.pdf`);

    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    fs.writeFileSync(path.join(__dirname, '..', mockFilePath), 'Dummy PDF Content');

    return mockFilePath;
};

// Mock generation for AI-optimized resume
const generateAIResume = async (userId, resumeData, jobDescription) => {
    console.log(`Generating AI optimized resume for user ${userId}`);
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    const mockFilePath = path.join('uploads', `ai_resume_${userId}_${Date.now()}.pdf`);

    await new Promise(resolve => setTimeout(resolve, 1000));

    fs.writeFileSync(path.join(__dirname, '..', mockFilePath), 'Dummy AI Optimized PDF Content');

    return mockFilePath;
};

module.exports = {
    generateTemplateResume,
    generateAIResume
};

const aiService = require('../services/aiService');
const resumeService = require('../services/resumeService');
const path = require('path');
const fs = require('fs');
const ChatHistory = require('../models/ChatHistory');

exports.optimizeResume = async (req, res) => {
    const { skills, experience, jobDescription } = req.body;
    try {
        const optimizedContent = await aiService.optimizeResume(skills, experience, jobDescription);
        res.json({ optimizedContent });
    } catch (error) {
        res.status(500).json({ message: 'Error optimizing resume', error: error.message });
    }
};

exports.analyzeSkillGap = async (req, res) => {
    const { skills, jobDescription } = req.body;
    try {
        const analysis = await aiService.analyzeSkillGap(skills, jobDescription);
        res.json({ analysis });
    } catch (error) {
        res.status(500).json({ message: 'Error analyzing skill gap', error: error.message });
    }
};

exports.chat = async (req, res) => {
    const { message, history } = req.body;
    try {
        const response = await aiService.chatWithAI(message, history || []);

        // Save chat history
        if (req.user) {
            await ChatHistory.create({
                userId: req.user._id,
                message,
                response
            });
        }

        res.json({ response });
    } catch (error) {
        res.status(500).json({ message: 'Error in AI chat', error: error.message });
    }
};

exports.downloadResume = async (req, res) => {
    const data = req.body;
    const fileName = `resume-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../utils', fileName);

    try {
        // Ensure utils directory exists
        if (!fs.existsSync(path.join(__dirname, '../utils'))) {
            fs.mkdirSync(path.join(__dirname, '../utils'));
        }

        await resumeService.generateResumePDF(data, filePath);
        res.download(filePath, 'optimized-resume.pdf', (err) => {
            if (err) {
                console.error('Download Error:', err);
            }
            // Delete file after download
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
};

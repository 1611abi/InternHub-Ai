const ATSReport = require('../models/ATSReport');
const atsService = require('../services/atsService');
const fs = require('fs');

const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No resume file uploaded' });
        }

        const filePath = req.file.path;

        // Call Python ML service for ATS Score
        const mlResult = await atsService.scoreATS(filePath);

        // Save report to MongoDB
        const report = await ATSReport.create({
            userId: req.user._id,
            score: mlResult.ATS_score,
            matchingSkills: mlResult.detected_skills,
            missingSkills: mlResult.missing_keywords,
            formattingScore: mlResult.formatting_score,
            contentScore: mlResult.content_score,
            suggestions: mlResult.suggestions,
            aiAnalysis: mlResult.ai_analysis
        });

        // Clean up uploaded file from Node backend if needed
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(201).json(report);
    } catch (error) {
        console.error('Create ATS Report Error:', error.message);
        res.status(500).json({ message: 'Error generating ATS report' });
    }
};

const analyzeSkillGap = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No resume file uploaded' });
        }

        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ message: 'Job description is required' });
        }

        const filePath = req.file.path;

        // Call Python ML service for Skill Gap
        const mlResult = await atsService.analyzeSkillGap(filePath, jobDescription);

        // Clean up uploaded file from Node backend if needed
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(201).json({
            matchingSkills: mlResult.matching_skills,
            missingSkills: mlResult.missing_skills,
            matchPercentage: mlResult.match_percentage,
            summary: mlResult.skill_gap_summary,
            roadmap: mlResult.learning_roadmap,
            aiAnalysis: mlResult.ai_analysis
        });
    } catch (error) {
        console.error('Skill Gap Analysis Error:', error.message);
        res.status(500).json({ message: 'Error analyzing skill gap' });
    }
};

const getUserATSReports = async (req, res) => {
    try {
        const reports = await ATSReport.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ATS reports' });
    }
};

module.exports = {
    analyzeResume,
    analyzeSkillGap,
    getUserATSReports
};

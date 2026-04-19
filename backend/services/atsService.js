const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

const callMLService = async (endpoint, filePath, jobDescription = null) => {
    if (!fs.existsSync(filePath)) {
        throw new Error('File not found at path: ' + filePath);
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    if (jobDescription) {
        form.append('job', jobDescription);
    }

    const response = await axios.post(`${ML_SERVICE_URL}${endpoint}`, form, {
        headers: {
            ...form.getHeaders()
        }
    });

    if (response.data.error) {
        throw new Error(response.data.error);
    }
    return response.data;
};

const scoreATS = async (filePath) => {
    try {
        console.log(`Sending Request to ML Service for ATS Score...`);
        const data = await callMLService("/analyze", filePath, "Software Engineer");
        
        return {
            ATS_score: data.score,
            detected_skills: data.matched_skills || [],
            missing_keywords: data.missing_skills || [],
            formatting_score: data.breakdown.structure || 50,
            content_score: data.breakdown.semantic || 50,
            suggestions: data.suggestions || ["No suggestions"],
            ai_analysis: data.grammar_errors && data.grammar_errors.length > 0 ? "Grammar errors found: " + data.grammar_errors.join(". ") : "Excellent professional structure."
        };
    } catch (error) {
        console.error('Error in Real-time ATS Score ML request:', error.message);
        throw error;
    }
};

const analyzeSkillGap = async (filePath, jobDescription) => {
    try {
        console.log(`Sending Request to ML Service for Skill Gap...`);
        const data = await callMLService("/skill-gap", filePath, jobDescription || "Software Engineer");

        return data; // Directly mapped to matching_skills, missing_skills, match_percentage, skill_gap_summary, learning_roadmap
    } catch (error) {
        console.error('Error in Real-time Skill Gap ML request:', error.message);
        throw error;
    }
};

const recommendJobs = async (filePath, jobsData = []) => {
    try {
        console.log(`Sending Request to ML Service for Job Ranking...`);
        const data = await callMLService("/recommend", filePath);
        
        return {
            ranked_jobs: data.jobs || []
        };
    } catch (error) {
        console.error('Error in Real-time ATS Recommendation ML request:', error.message);
        throw error;
    }
};

const extractSkills = async (filePath) => {
    try {
        console.log(`Sending Request to ML Service for Skill Extraction...`);
        const data = await callMLService("/skill-gap", filePath, "General Software Engineering Skills");
        
        return {
            skills: [...(data.matching_skills || []), ...(data.missing_skills || [])].join(", ")
        };
    } catch (error) {
        console.error('Error extracting skills via Python ML:', error.message);
        throw error;
    }
};

module.exports = {
    scoreATS,
    analyzeSkillGap,
    recommendJobs,
    extractSkills
};

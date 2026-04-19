const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || 'dummy_key' 
});

const generateCompletion = async (prompt) => {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_key_here' || process.env.GEMINI_API_KEY === 'dummy_key') {
            throw new Error('GEMINI_API_KEY is missing in your .env file. Real-time AI is disabled.');
        }
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error('Gemini Error:', error.message);
        throw error;
    }
};

const optimizeResume = async (studentSkills, experience, jobDescription) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_key_here' || process.env.GEMINI_API_KEY === 'dummy_key') {
        throw new Error('Please configure GEMINI_API_KEY in backend/.env to get real-time resume optimization.');
    }
    const prompt = `
    You are an expert ATS (Applicant Tracking System) reviewer and tech recruiter. 
    Optimize the following resume details for the given job description. Do not hallucinate experiences the candidate doesn't have.
    
    Candidate Skills: ${studentSkills}
    Candidate Experience: ${experience}
    Target Job Description: ${jobDescription}
    
    Output a highly professional analysis with the following EXACT structure:
    # Optimized Resume Review
    **Target Keywords Found/Missing**: [List them]
    **Optimized Bullet Points**: 
    [Provide 3-5 improved, action-oriented, metrics-driven bullet points using the candidate's experience]
    **Skill Match**: [Calculate a rigorous match percentage]
  `;
    return await generateCompletion(prompt);
};

const analyzeSkillGap = async (studentSkills, jobDescription) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_key_here' || process.env.GEMINI_API_KEY === 'dummy_key') {
        throw new Error('Please configure GEMINI_API_KEY in backend/.env to get a real-time Skill Gap Analysis.');
    }
    const prompt = `
    Conduct a comprehensive skill gap analysis for a technical role.
    
    Candidate Current Skills: ${studentSkills}
    Target Job Description: ${jobDescription}
    
    Create a detailed response strictly following this structure:
    **Critical Missing Skills**: [List the exact mandatory skills the candidate lacks]
    **Actionable 4-Week Roadmap**: 
    [Provide a week-by-week technical learning plan tailored to bridge these exact gaps]
    **Recommended Free Resources**: [Direct links/names to targeted hands-on content like well-known GitHub repos, documentation, or free certifications]
  `;
    return await generateCompletion(prompt);
};

const chatWithAI = async (userMessage, history = []) => {
    const systemPrompt = "You are InternHub AI Career Assistant. You help students realistically and efficiently with career guidance, learning paths, project ideas, and internship advice. Be professional and encouraging.";

    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_key_here' || process.env.GEMINI_API_KEY === 'dummy_key') {
            throw new Error('GEMINI_API_KEY missing - chatbot cannot generate a response.');
        }
        
        let allMessages = systemPrompt + "\n\n";
        if (Array.isArray(history)) {
            history.forEach(m => {
                allMessages += `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}\n`;
            });
        }
        allMessages += `User: ${userMessage}\nAssistant:`;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: allMessages,
        });
        return response.text;
    } catch (error) {
        console.error('Gemini Chat Error:', error.message);
        throw new Error('Error communicating with Google Gemini API. Ensure your key is valid and you have network connectivity.');
    }
};

const extractSkillsFromResume = async (resumeText) => {
    const safeText = resumeText ? resumeText.substring(0, 1500) : "";
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_key_here' || process.env.GEMINI_API_KEY === 'dummy_key') {
        throw new Error('GEMINI_API_KEY missing - cannot accurately extract skills.');
    }
    
    const prompt = `
    Analyze the following resume text and extract the top 5 most important technical skills. 
    Output them strictly separated by a space (e.g. "React Nodejs Python Docker DevOps"). DO NOT explain.
    
    Resume Text: ${safeText}
    `;
    
    const skills = await generateCompletion(prompt);
    
    if (skills) {
        return skills.replace(/["'\n,-]/g, ' ').trim();
    }
    
    return "Software Engineer"; 
};

module.exports = {
    optimizeResume,
    analyzeSkillGap,
    chatWithAI,
    extractSkillsFromResume
};

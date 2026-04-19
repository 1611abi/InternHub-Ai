const Job = require('../models/Job');
const Application = require('../models/Application');
const atsService = require('../services/atsService');
const fs = require('fs');

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const existingApplication = await Application.findOne({ studentId: req.user._id, jobId });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const { applicantName, applicantEmail, applicantPhone, resumeLink } = req.body;

        if (!applicantName || !applicantEmail || !applicantPhone || !resumeLink) {
            return res.status(400).json({ message: 'Please provide all required fields (name, email, phone, resumeLink)' });
        }

        const application = await Application.create({
            studentId: req.user._id,
            jobId,
            applicantName,
            applicantEmail,
            applicantPhone,
            resumeLink
        });

        res.status(201).json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ studentId: req.user._id }).populate('jobId');
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const recommendJobsFromResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No resume file uploaded' });
        }

        const filePath = req.file.path;
        const scraperService = require('../services/scraperService');
        const aiService = require('../services/aiService');
        const pdfParse = require('pdf-parse'); // Need this to extract text for Ollama

        let recommendedJobs = [];
        
        // Call ML service
        const mlResult = await atsService.recommendJobs(filePath, []);

        if (!mlResult.error && mlResult.ranked_jobs && mlResult.ranked_jobs.length > 0) {
            recommendedJobs = mlResult.ranked_jobs.map(rj => ({
                _id: rj.id,
                title: rj.title,
                companyName: rj.company || "InternHub Partner",
                location: "Remote / Multiple Locations",
                description: `Matched from FAISS model in domain: ${rj.domain || 'Technology'}`,
                applicationLink: "#",
                similarityScore: rj.similarityScore,
                skillsRequired: ["Matched using ML"]
            }));
        }

        // FALLBACK: If ML Service returned 0 jobs (due to <30% match) OR error
        if (recommendedJobs.length === 0) {
            console.log("No DB jobs met the threshold. Falling back to ScraperService...");
            
            let searchKeywords = "";
            try {
                // Call ML Service to extract skills from the PDF
                const mlSkillResult = await atsService.extractSkills(filePath);
                if (mlSkillResult && mlSkillResult.skills) {
                    searchKeywords = mlSkillResult.skills;
                    console.log(`ML Extracted Skills for scraping: ${searchKeywords}`);
                }
            } catch (err) {
                console.error("Failed to extract skills via ML Service:", err.message);
            }
            
            const scrapedInternships = await scraperService.getAggregatedInternships(searchKeywords);
            
            // Format scraped jobs to match frontend JobRecommendation expectations
            recommendedJobs = scrapedInternships.map(job => ({
                _id: Math.random().toString(36).substring(7),
                title: job.title,
                companyName: job.company, // Map 'company' from scraper
                location: job.location,
                description: `Extracted from ${job.platform}. Please review the link for full details.`,
                applicationLink: job.link,
                similarityScore: 100, // Dummy score so UI looks normal
                skillsRequired: [searchKeywords, 'Web Scraped Match']
            }));
            
            console.log(`Scraped ${recommendedJobs.length} fallback jobs.`);
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json(recommendedJobs);

    } catch (error) {
        console.error('Recommend Jobs Error:', error.message);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Error generating job recommendations' });
    }
};

module.exports = { getJobs, applyForJob, getMyApplications, recommendJobsFromResume };

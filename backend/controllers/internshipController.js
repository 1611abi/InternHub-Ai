const scraperService = require('../services/scraperService');
const Job = require('../models/Job');
const Internship = require('../models/Internship');

exports.searchInternships = async (req, res) => {
    const { domain } = req.query;
    if (!domain) {
        return res.status(400).json({ message: 'Domain is required' });
    }

    try {
        // Find jobs in our local database where title, company, or skills match the search keyword
        const regex = new RegExp(domain, 'i');
        
        // Fetch from local DB and scraper concurrently
        const [localJobs, scrapedJobs] = await Promise.all([
            Job.find({
                $or: [
                    { title: regex },
                    { companyName: regex },
                    { description: regex },
                    { skillsRequired: { $in: [regex] } }
                ]
            }).sort({ createdAt: -1 }),
            scraperService.getAggregatedInternships(domain).catch(err => {
                console.error("Scraper failed, falling back to empty array", err);
                return [];
            })
        ]);

        // Format these DB jobs into the shape the frontend is expecting from the scraper
        const formattedJobs = localJobs.map(job => ({
            _id: job._id,
            title: job.title,
            company: job.companyName,
            location: job.location,
            source: 'AntiGravity Jobs', // Differentiate from scraped sources
            link: job.applyLink || `/jobs/${job._id}`, // If it has an external link use it, otherwise local link
            stipend: job.stipend,
            duration: job.duration
        }));

        const combined = [...formattedJobs, ...scrapedJobs];
        res.json(combined);
    } catch (error) {
        console.error('Error fetching internships', error);
        res.status(500).json({ message: 'Error fetching internships', error: error.message });
    }
};

exports.saveInternship = async (req, res) => {
    try {
        const internship = new Internship(req.body);
        await internship.save();
        res.status(201).json({ message: 'Internship saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving internship', error: error.message });
    }
};

exports.getSavedInternships = async (req, res) => {
    try {
        const saved = await Internship.find().sort({ postedAt: -1 });
        res.json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved internships', error: error.message });
    }
};

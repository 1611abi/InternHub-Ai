const CompanyProfile = require('../models/CompanyProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');

const getCompanyProfile = async (req, res) => {
    try {
        const company = await CompanyProfile.findOne({ createdBy: req.user._id });
        if (!company) {
            return res.status(404).json({ message: 'Company profile not found' });
        }
        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createCompany = async (req, res) => {
    try {
        const existing = await CompanyProfile.findOne({ createdBy: req.user._id });
        if (existing) {
            return res.status(400).json({ message: 'Company profile already exists' });
        }
        const company = await CompanyProfile.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const postJob = async (req, res) => {
    try {
        const company = await CompanyProfile.findOne({ createdBy: req.user._id });
        const job = await Job.create({
            ...req.body,
            companyId: company ? company._id : undefined,
            companyName: req.body.companyName || (company ? company.companyName : "Unknown Company"),
            postedBy: req.user._id
        });
        res.status(201).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const editJob = async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, postedBy: req.user._id },
            req.body,
            { new: true }
        );
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getApplicants = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
        if (!job) return res.status(403).json({ message: 'Unauthorized or job not found' });

        const applications = await Application.find({ jobId: req.params.jobId }).populate('studentId', 'name email');
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const acceptApplicant = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('jobId');
        if (!application) return res.status(404).json({ message: 'Application not found' });
        
        if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        application.status = 'shortlisted'; // mapping 'accepted' to 'shortlisted' in model enum or update model
        await application.save();
        res.json({ message: 'Applicant accepted', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const rejectApplicant = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('jobId');
        if (!application) return res.status(404).json({ message: 'Application not found' });
        
        if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        application.status = 'rejected';
        await application.save();
        res.json({ message: 'Applicant rejected', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['applied', 'shortlisted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await Application.findById(req.params.id).populate('jobId');
        if (!application) return res.status(404).json({ message: 'Application not found' });
        
        if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        application.status = status;
        await application.save();
        res.json({ message: `Application status updated to ${status}`, application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createCompany, postJob, getMyJobs, editJob, deleteJob, getApplicants, updateApplicationStatus, getCompanyProfile, acceptApplicant, rejectApplicant
};

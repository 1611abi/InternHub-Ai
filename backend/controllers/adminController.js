const User = require('../models/User');
const Job = require('../models/Job');
const CompanyProfile = require('../models/CompanyProfile');
const Application = require('../models/Application');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name email');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const removeJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getRecruiters = async (req, res) => {
    try {
        const recruiters = await User.find({ role: 'recruiter' }).select('-password');
        const companies = await CompanyProfile.find();
        res.json({ recruiters, companies });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const verifyRecruiter = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await CompanyProfile.findByIdAndUpdate(companyId, { isVerified: true }, { new: true });
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const Resource = require('../models/careervault/Resource');

const getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
        const totalInternships = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();
        const totalResources = await Resource.countDocuments();
        const pendingResources = await Resource.countDocuments({ status: 'Pending' });

        res.json({
            totalUsers,
            totalStudents,
            totalRecruiters,
            totalInternships,
            totalApplications,
            totalResources,
            pendingResources
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getUsers,
    deleteUser,
    getJobs,
    removeJob,
    getRecruiters,
    verifyRecruiter,
    getPlatformStats
};

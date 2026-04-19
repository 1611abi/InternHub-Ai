const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ATSReport = require('../models/ATSReport');
const Resume = require('../models/Resume');
const ChatHistory = require('../models/ChatHistory');
const { protect } = require('../middleware/authMiddleware');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const atsReports = await ATSReport.find({ userId: req.user._id }).sort({ createdAt: -1 });
        const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
        const chatHistory = await ChatHistory.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(50); // Fetch recent 50

        res.json({
            user,
            atsReports,
            resumes,
            chatHistory
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Server Error Fetching Profile' });
    }
};

router.get('/', protect, getProfile);

module.exports = router;

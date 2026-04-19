const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const {
    getUsers, deleteUser, getJobs, removeJob, getRecruiters, verifyRecruiter, getPlatformStats
} = require('../controllers/adminController');

router.get('/users', protect, requireAdmin, getUsers);
router.delete('/delete-user/:id', protect, requireAdmin, deleteUser);
router.get('/jobs', protect, requireAdmin, getJobs);
router.delete('/remove-job/:id', protect, requireAdmin, removeJob);
router.get('/recruiters', protect, requireAdmin, getRecruiters);
router.put('/verify-recruiter/:id', protect, requireAdmin, verifyRecruiter);
router.get('/platform-stats', protect, requireAdmin, getPlatformStats);

module.exports = router;

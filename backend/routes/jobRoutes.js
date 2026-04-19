const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getJobs, applyForJob, getMyApplications, recommendJobsFromResume } = require('../controllers/jobController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/', getJobs);
router.post('/recommend', protect, upload.single('resume'), recommendJobsFromResume);
router.get('/applications', protect, getMyApplications);
router.post('/apply/:jobId', protect, applyForJob);

module.exports = router;

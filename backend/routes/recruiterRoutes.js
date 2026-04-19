const express = require('express');
const router = express.Router();
const { protect, requireRecruiter } = require('../middleware/authMiddleware');
const {
    createCompany, postJob, getMyJobs, editJob, deleteJob, getApplicants, updateApplicationStatus, getCompanyProfile, acceptApplicant, rejectApplicant
} = require('../controllers/recruiterController');

router.get('/company', protect, requireRecruiter, getCompanyProfile);
router.post('/create-company', protect, requireRecruiter, createCompany);
router.post('/post-job', protect, requireRecruiter, postJob);
router.get('/my-jobs', protect, requireRecruiter, getMyJobs);
router.put('/edit-job/:id', protect, requireRecruiter, editJob);
router.delete('/delete-job/:id', protect, requireRecruiter, deleteJob);
router.get('/applicants/:jobId', protect, requireRecruiter, getApplicants);
router.put('/application/:id/accept', protect, requireRecruiter, acceptApplicant);
router.put('/application/:id/reject', protect, requireRecruiter, rejectApplicant);
router.put('/application/:id/status', protect, requireRecruiter, updateApplicationStatus);

module.exports = router;

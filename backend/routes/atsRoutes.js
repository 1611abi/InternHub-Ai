const express = require('express');
const router = express.Router();
const { analyzeResume, analyzeSkillGap, getUserATSReports } = require('../controllers/atsController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', protect, upload.single('resume'), analyzeResume);
router.post('/skill-gap', protect, upload.single('resume'), analyzeSkillGap);
router.get('/', protect, getUserATSReports);

module.exports = router;

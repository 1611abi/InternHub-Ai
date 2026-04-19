const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/optimize-resume', protect, aiController.optimizeResume);
router.post('/skill-gap', protect, aiController.analyzeSkillGap);
router.post('/chat', protect, aiController.chat);
router.post('/download-resume', protect, aiController.downloadResume);

module.exports = router;

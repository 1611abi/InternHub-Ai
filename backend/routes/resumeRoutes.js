const express = require('express');
const router = express.Router();
const { createTemplateResume, createAIResume, getUserResumes, aiEnhance, exportPdf } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/template', protect, createTemplateResume);
router.post('/ai', protect, createAIResume);
router.get('/', protect, getUserResumes);
router.post('/ai-enhance', protect, aiEnhance);
router.post('/export-pdf', protect, exportPdf);

module.exports = router;

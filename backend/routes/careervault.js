const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
    getResources,
    getResource,
    searchResources,
    getByField,
    createResource,
    updateResource,
    deleteResource,
    upvoteResource,
    saveResource,
    rateResource,
    reportResource,
    createFolder,
    getFolders,
    getFolder,
    addResourceToFolder,
    deleteFolder,
    getPendingResources,
    approveResource,
    rejectResource
} = require('../controllers/careervaultController');

const { protectVault, adminOnly } = require('../middleware/careervaultAuth');
const upload = require('../middleware/uploadMiddleware');

// ─── Public Routes ───
router.get('/resources', getResources);
router.get('/resources/:id', getResource);
router.get('/search', searchResources);
router.get('/field/:field', getByField);

// ─── Protected User Routes ───

// Create new resource
router.post(
    '/resources',
    protectVault,
    upload.single('file'),
    [
        check('title', 'Title is required').not().isEmpty(),
        check('type', 'Type must be valid').isIn(['youtube', 'course', 'roadmap', 'notes', 'github']),
        check('field', 'Field is required').not().isEmpty(),
        check('difficulty', 'Difficulty must be valid').isIn(['beginner', 'intermediate', 'advanced'])
    ],
    createResource
);

router.put('/resources/:id', protectVault, updateResource);
router.delete('/resources/:id', protectVault, deleteResource);

// Resource interactions
router.post('/resources/:id/upvote', protectVault, upvoteResource);
router.post('/resources/:id/save', protectVault, saveResource);
router.post('/resources/:id/rate', protectVault, rateResource);
router.post('/resources/:id/report', protectVault, reportResource);

// ─── Folders (Structured Learning Paths) ───
router.get('/folders', getFolders);
router.get('/folders/:id', getFolder);
router.post('/folders', protectVault, createFolder);
router.post('/folders/:id/add', protectVault, addResourceToFolder);
router.delete('/folders/:id', protectVault, deleteFolder);

// ─── Admin Routes ───
router.get('/admin/pending', protectVault, adminOnly, getPendingResources);
router.put('/admin/approve/:id', protectVault, adminOnly, approveResource);
router.put('/admin/reject/:id', protectVault, adminOnly, rejectResource);

module.exports = router;

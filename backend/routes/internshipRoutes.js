const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');

router.get('/', internshipController.searchInternships);
router.post('/save', internshipController.saveInternship);
router.get('/saved', internshipController.getSavedInternships);

module.exports = router;

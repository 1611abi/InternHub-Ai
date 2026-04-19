const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, conversationController.listConversations);
router.get('/:id', protect, conversationController.getConversation);
router.post('/', protect, conversationController.createConversation);
router.post('/:id/messages', protect, conversationController.sendMessage);
router.patch('/:id', protect, conversationController.updateTitle);
router.delete('/:id', protect, conversationController.deleteConversation);

module.exports = router;

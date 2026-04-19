const Conversation = require('../models/Conversation');
const aiService = require('../services/aiService');

// List all conversations for authenticated user (title + date only)
exports.listConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ userId: req.user._id })
            .select('title createdAt updatedAt')
            .sort({ updatedAt: -1 })
            .lean();
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch conversations', error: error.message });
    }
};

// Get a single conversation with all messages
exports.getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).lean();

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch conversation', error: error.message });
    }
};

// Create a new conversation and send the first message
exports.createConversation = async (req, res) => {
    const { message } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        // Auto-generate title from first message
        const title = message.length > 50 ? message.substring(0, 50) + '...' : message;

        const conversation = await Conversation.create({
            userId: req.user._id,
            title,
            messages: [{ role: 'user', content: message }]
        });

        // Get AI response
        const aiResponse = await aiService.chatWithAI(message, []);

        conversation.messages.push({ role: 'assistant', content: aiResponse });
        await conversation.save();

        res.status(201).json(conversation);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create conversation', error: error.message });
    }
};

// Send a message in an existing conversation
exports.sendMessage = async (req, res) => {
    const { message } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        const conversation = await Conversation.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Add user message
        conversation.messages.push({ role: 'user', content: message });

        // Build recent history for context (last 10 messages)
        const recentHistory = conversation.messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
        }));

        // Get AI response
        const aiResponse = await aiService.chatWithAI(message, recentHistory.slice(0, -1));

        conversation.messages.push({ role: 'assistant', content: aiResponse });
        await conversation.save();

        // Return only the two new messages
        const newMessages = conversation.messages.slice(-2);
        res.json({
            conversationId: conversation._id,
            messages: newMessages
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};

// Update conversation title
exports.updateTitle = async (req, res) => {
    const { title } = req.body;
    try {
        const conversation = await Conversation.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title },
            { new: true }
        ).select('title');

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update title', error: error.message });
    }
};

// Delete a conversation
exports.deleteConversation = async (req, res) => {
    try {
        const result = await Conversation.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!result) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.json({ message: 'Conversation deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete conversation', error: error.message });
    }
};

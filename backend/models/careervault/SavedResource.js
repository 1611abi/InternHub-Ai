const mongoose = require('mongoose');

const SavedResourceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true, index: true },
    savedAt: { type: Date, default: Date.now }
});

// Compound unique index
SavedResourceSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

module.exports = mongoose.model('SavedResource', SavedResourceSchema);

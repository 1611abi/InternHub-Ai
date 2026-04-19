const mongoose = require('mongoose');

const ResourceReportSchema = new mongoose.Schema({
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true, index: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'rejected'],
        default: 'pending',
        index: true
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date }
}, {
    timestamps: true
});

module.exports = mongoose.model('ResourceReport', ResourceReportSchema);

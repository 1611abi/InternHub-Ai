const mongoose = require('mongoose');

const ATSReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    matchingSkills: { type: [String], default: [] },
    partiallyMatchingSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    aiAnalysis: { type: String, default: "" },
    score: { type: Number, required: true },
    formattingScore: { type: Number, default: 0 },
    contentScore: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ATSReport', ATSReportSchema);

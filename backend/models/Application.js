const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantPhone: { type: String, required: true },
    resumeLink: { type: String, required: true }, // Can be a URL or file path pointing to their uploaded resume
    status: { 
        type: String, 
        enum: ['applied', 'shortlisted', 'rejected'], 
        default: 'applied' 
    },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);

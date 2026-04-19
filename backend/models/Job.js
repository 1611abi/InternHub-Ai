const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    location: { type: String, required: true },
    stipend: { type: String },
    duration: { type: String },
    applyLink: { type: String },
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Adding optional reference to CompanyProfile for richer data if needed
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyProfile'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);

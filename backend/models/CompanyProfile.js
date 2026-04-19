const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    companyLogo: { type: String },
    website: { type: String },
    industry: { type: String },
    location: { type: String },
    aboutCompany: { type: String },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    isVerified: { type: Boolean, default: false }, // Useful for admin moderation
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);

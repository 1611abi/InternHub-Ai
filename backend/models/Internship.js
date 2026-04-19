const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    platform: { type: String },
    link: { type: String, required: true },
    source: { type: String },
    postedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Internship', internshipSchema);

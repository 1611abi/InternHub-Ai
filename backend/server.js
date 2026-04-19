const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const internshipRoutes = require('./routes/internshipRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const atsRoutes = require('./routes/atsRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const careervaultRoutes = require('./routes/careervault');

// New Routes
const recruiterRoutes = require('./routes/recruiterRoutes');
const adminRoutes = require('./routes/adminRoutes');
const jobRoutes = require('./routes/jobRoutes');

// Serve uploads folder statically so PDFs can be downloaded/viewed
app.use('/uploads', express.static('uploads'));

app.use('/api/internships', internshipRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/careervault', careervaultRoutes);

app.use('/api/recruiter', recruiterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('InternHub AI Backend is Running');
});

// Database Connection
const getMongoURI = () => {
    if (process.env.DB_MODE === 'local') {
        return process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/internhub';
    }
    return process.env.MONGODB_URI || 'mongodb://localhost:27017/internhub';
};

const connectDB = async () => {
    try {
        const uri = getMongoURI();
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, 
        });
        
        if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
            console.log('Connected to MongoDB Local (Fallback)');
        } else {
            console.log('Connected to MongoDB Atlas');
        }
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

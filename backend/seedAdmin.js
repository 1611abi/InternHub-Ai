// Create a script to generate the first admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Assuming this script is at backend root

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/internhub')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const createAdmin = async () => {
    try {
        const adminEmail = 'admin@internhub.com';
        const adminPassword = 'adminpassword123';

        // Check if admin already exists
        let admin = await User.findOne({ email: adminEmail });
        
        if (admin) {
            console.log('Admin user already exists!');
            console.log(`Email: ${adminEmail}`);
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create the admin user
        admin = new User({
            name: 'Super Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin' // CRITICAL: This grants admin access
        });

        await admin.save();

        console.log('='*40);
        console.log('✅ Admin user successfully created!');
        console.log('='*40);
        console.log(`Email:    ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('='*40);
        console.log('You can now log in using the standard /login page with these credentials.');

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        mongoose.disconnect();
        process.exit(0);
    }
};

createAdmin();

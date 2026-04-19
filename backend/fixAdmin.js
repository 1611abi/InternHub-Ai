const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/internhub')
  .then(async () => {
    const res = await mongoose.connection.db.collection('users').updateOne(
        { email: 'admin@internhub.com' },
        { $set: { role: 'admin' } }
    );
    console.log('Update Result:', res);
    
    // Also, let's just make sure there are no other admin accounts missing the role
    const adminUser = await mongoose.connection.db.collection('users').findOne({ email: 'admin@internhub.com' });
    console.log('Admin user found:', adminUser);
    
    process.exit(0);
  });

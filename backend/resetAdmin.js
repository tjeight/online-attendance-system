const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import Admin model
const Admin = require('./models/Admin');

// Direct MongoDB connection - using common MongoDB local connection
const MONGO_URI = 'mongodb://localhost:27017/attendance-system';

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for Admin Reset'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

const resetAdminUser = async () => {
  try {
    // Delete all existing admin users
    await Admin.deleteMany({});
    console.log('All previous admin accounts deleted');
    
    // Create the new admin with specified credentials
    const admin = new Admin({
      username: 'MESIMCC',
      email: 'admin@mesimcc.com',
      password: 'mesimccpune'
    });
    
    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Username: MESIMCC');
    console.log('Password: mesimccpune');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin user:', error);
    process.exit(1);
  }
};

resetAdminUser(); 
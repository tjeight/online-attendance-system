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
.then(() => console.log('MongoDB Connected for Admin Test'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

const testAdminLogin = async () => {
  try {
    // First check if the admin user exists
    const admin = await Admin.findOne({ username: 'MESIMCC' });
    
    if (!admin) {
      console.log('Admin user with username MESIMCC not found in database');
      console.log('Creating the admin user...');
      
      // Create the admin user
      const newAdmin = new Admin({
        username: 'MESIMCC',
        email: 'admin@mesimcc.com',
        password: 'mesimccpune'
      });
      
      await newAdmin.save();
      console.log('Admin user created successfully!');
      
      // Get the newly created admin
      const createdAdmin = await Admin.findOne({ username: 'MESIMCC' });
      console.log('Admin details:', {
        id: createdAdmin._id,
        username: createdAdmin.username,
        email: createdAdmin.email,
        passwordLength: createdAdmin.password.length
      });
      
      // Test the password
      const testPassword = 'mesimccpune';
      const passwordMatch = await bcrypt.compare(testPassword, createdAdmin.password);
      console.log(`Password 'mesimccpune' matches: ${passwordMatch}`);
      
    } else {
      console.log('Admin user found in database:', {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        passwordLength: admin.password.length
      });
      
      // Test the password
      const testPassword = 'mesimccpune';
      const passwordMatch = await bcrypt.compare(testPassword, admin.password);
      console.log(`Password 'mesimccpune' matches: ${passwordMatch}`);

      if (!passwordMatch) {
        console.log('Password does not match. Resetting admin password...');
        admin.password = 'mesimccpune';
        await admin.save();
        
        // Verify the new password
        const updatedAdmin = await Admin.findOne({ username: 'MESIMCC' });
        const newPasswordMatch = await bcrypt.compare(testPassword, updatedAdmin.password);
        console.log(`Password reset. New password 'mesimccpune' matches: ${newPasswordMatch}`);
      }
    }
    
    console.log('Test complete. You should now be able to login with:');
    console.log('Username: MESIMCC');
    console.log('Password: mesimccpune');
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing admin login:', error);
    process.exit(1);
  }
};

testAdminLogin(); 
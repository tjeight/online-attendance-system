const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import Admin model
const Admin = require('./models/Admin');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for Admin Creation'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({ username: 'MESIMCC' });
    
    if (adminExists) {
      console.log('Admin user already exists!');
      return process.exit(0);
    }
    
    // Create a new admin
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
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser(); 
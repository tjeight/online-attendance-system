const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Import models
const Admin = require('../models/Admin');
const Faculty = require('../models/Faculty');
const Student = require('../models/student');

// Admin registration (initial setup only)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with that email or username already exists' });
    }
    
    // Create new admin
    const admin = new Admin({
      username,
      email,
      password
    });
    
    await admin.save();
    
    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Return admin data (excluding password)
    const adminData = {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin
    };
    
    res.status(200).json({ message: 'Login successful', admin: adminData });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Get all faculty
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find({}, { password: 0 }); // Exclude password
    const count = await Faculty.countDocuments();
    
    res.status(200).json({ count, faculty });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Error fetching faculty data', error: error.message });
  }
});

// Get all students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({}, { password: 0 }); // Exclude password
    const count = await Student.countDocuments();
    
    res.status(200).json({ count, students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching student data', error: error.message });
  }
});

// Delete a faculty member
router.delete('/faculty/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Faculty.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    
    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ message: 'Error deleting faculty', error: error.message });
  }
});

// Delete a student
router.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Student.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

module.exports = router; 
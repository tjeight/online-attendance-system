const express = require('express');
const bcrypt = require('bcrypt');
const Faculty = require('../models/Faculty');
const Subject = require('../models/subject');

const router = express.Router();

// @route   POST /api/faculty/register
// @desc    Register new faculty
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, teacherId, password } = req.body;

    // Check if email already registered
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty already registered' });
    }

    // Create new faculty document
    const newFaculty = new Faculty({
      name,
      email,
      teacherId,
      password // Password hashing handled by pre-save hook in the model
    });

    await newFaculty.save();

    res.status(201).json({ message: 'Faculty registered successfully' });

  } catch (error) {
    console.error('Faculty registration error:', error);
    res.status(500).json({ message: 'Error registering faculty', error: error.message });
  }
});

// @route   POST /api/faculty/login
// @desc    Faculty login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const faculty = await Faculty.findOne({ email, isActive: true });

    if (!faculty) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, faculty.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        teacherId: faculty.teacherId,
        department: faculty.department,
        position: faculty.position,
        phoneNumber: faculty.phoneNumber,
        officeLocation: faculty.officeLocation
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// @route   GET /api/faculty/profile
// @desc    Get faculty profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    // In a real application, you would get the faculty ID from the authenticated user's session/token
    // For now, we'll use a query parameter for demonstration
    const { facultyId } = req.query;
    
    if (!facultyId) {
      return res.status(400).json({ message: 'Faculty ID is required' });
    }

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json({
      name: faculty.name,
      email: faculty.email,
      teacherId: faculty.teacherId,
      department: faculty.department || 'Not specified',
      position: faculty.position || 'Not specified',
      phoneNumber: faculty.phoneNumber,
      officeLocation: faculty.officeLocation,
      joinDate: faculty.joinDate,
      profileImage: faculty.profileImage
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculty profile', error: error.message });
  }
});

// @route   GET /api/faculty/subjects
// @desc    Get all subjects assigned to a faculty
// @access  Private
router.get('/subjects', async (req, res) => {
  try {
    const { facultyId } = req.query;
    
    if (!facultyId) {
      return res.status(400).json({ message: 'Faculty ID is required' });
    }
    
    // Find all subjects where this faculty is assigned
    const subjects = await Subject.find({ facultyIds: facultyId });
    
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching faculty subjects:', error);
    res.status(500).json({ message: 'Error fetching faculty subjects', error: error.message });
  }
});

// @route   POST /api/faculty/assign-subject
// @desc    Assign a subject to a faculty
// @access  Admin (for demonstration, no auth check)
router.post('/assign-subject', async (req, res) => {
  try {
    const { facultyId, subjectId } = req.body;
    
    if (!facultyId || !subjectId) {
      return res.status(400).json({ message: 'Faculty ID and Subject ID are required' });
    }
    
    // Check if faculty exists
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    
    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Add faculty to the subject if not already assigned
    if (!subject.facultyIds.includes(facultyId)) {
      subject.facultyIds.push(facultyId);
      await subject.save();
    }
    
    res.status(200).json({ message: 'Subject assigned to faculty successfully' });
  } catch (error) {
    console.error('Error assigning subject to faculty:', error);
    res.status(500).json({ message: 'Error assigning subject to faculty', error: error.message });
  }
});

module.exports = router;

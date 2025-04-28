const express = require('express');
const bcrypt = require('bcrypt');
const Student = require('../models/student'); // Fixed the capitalization to match the actual file name
const router = express.Router();

// Register student
router.post('/register', async (req, res) => {
  try {
    const { name, email, className, rollNumber, password } = req.body;
    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      return res.status(400).json({ message: 'Student already registered' });
    }

    const newStudent = new Student({ name, email, className, rollNumber, password });
    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Error registering student', error: err.message });
  }
});

// Login student
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', student });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;

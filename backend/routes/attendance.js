// // routes/attendance.js
// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');

// const attendanceConnection = mongoose.createConnection('mongodb://localhost:27017/attendance');
// const AttendanceSchema = new mongoose.Schema({
//   date: String,
//   subjectId: Number,
//   subjectName: String,
//   time: String,
//   facultyId: String,
//   attendance: [
//     {
//       rollNumber: String,
//       present: Boolean
//     }
//   ]
// });
// const Attendance = attendanceConnection.model('AttendanceRecord', AttendanceSchema);

// router.post('/', async (req, res) => {
//   const data = req.body;
//   const newRecord = new Attendance(data);
//   await newRecord.save();
//   res.json({ message: 'Attendance saved successfully' });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const Attendance = require('../models/AttendanceRecord');
const Student = require('../models/student');

// Get all subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get students for a specific subject
router.get('/students-by-subject/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    // In a real app, you would have a subject-student relationship
    // Here we're just getting all students for demo purposes
    const students = await Student.find().select('_id name email className rollNumber');
    
    res.json(students);
  } catch (err) {
    console.error('Error fetching students by subject:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get attendance records for a subject
router.get('/records/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    const records = await Attendance.find({ subjectId });
    res.json(records);
  } catch (err) {
    console.error('Error fetching attendance records:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save attendance
router.post('/mark', async (req, res) => {
  try {
    const { 
      facultyId, 
      facultyName, 
      subjectId, 
      subjectName, 
      date, 
      timeSlot, 
      attendanceDetails, 
      attendance 
    } = req.body;
    
    if (!facultyId || !subjectId || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const record = new Attendance({
      facultyId,
      facultyName,
      subjectId,
      subjectName,
      date,
      timeSlot,
      attendanceDetails,
      attendance
    });
    
    await record.save();
    res.status(201).json({ message: 'Attendance saved successfully' });
  } catch (err) {
    console.error('Error saving attendance:', err);
    res.status(500).json({ error: 'Could not save attendance' });
  }
});

// Get all subjects for student dashboard
router.get('/student-subjects', async (req, res) => {
  try {
    // In a real app, you would filter subjects based on student's class/enrollment
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching subjects for student:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get attendance percentage for a student by subject
router.get('/student-attendance/:studentId/:subjectId', async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;
    
    // Get all attendance records for this subject
    const attendanceRecords = await Attendance.find({ subjectId });
    
    if (attendanceRecords.length === 0) {
      return res.json({ 
        totalClasses: 0,
        present: 0,
        percentage: 0,
        attendanceDetails: []
      });
    }
    
    // Calculate attendance statistics
    let totalClasses = 0;
    let presentCount = 0;
    const attendanceDetails = [];
    
    // Process each record
    attendanceRecords.forEach(record => {
      totalClasses++;
      
      // Check attendance in detailed format
      const studentRecord = record.attendanceDetails?.find(detail => 
        detail.studentId.toString() === studentId
      );
      
      // If not found in details, check old format
      const isPresent = studentRecord?.present || record.attendance?.[studentId] || false;
      
      if (isPresent) {
        presentCount++;
      }
      
      // Add to details for display
      attendanceDetails.push({
        date: record.date,
        time: record.timeSlot,
        present: isPresent,
        facultyName: record.facultyName
      });
    });
    
    // Calculate percentage
    const percentage = totalClasses === 0 ? 0 : Math.round((presentCount / totalClasses) * 100);
    
    res.json({
      totalClasses,
      present: presentCount,
      percentage,
      attendanceDetails
    });
    
  } catch (err) {
    console.error('Error fetching student attendance:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

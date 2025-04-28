const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  facultyId: String,
  facultyName: String,
  subjectId: mongoose.Schema.Types.ObjectId,
  subjectName: String,
  date: String, // "YYYY-MM-DD"
  timeSlot: String, // "HH:mm"
  // Store more detailed attendance data
  attendanceDetails: [{
    studentId: mongoose.Schema.Types.ObjectId,
    rollNumber: String,
    name: String,
    present: Boolean
  }],
  // Keep the original format for backward compatibility
  attendance: Object, // { studentId: isPresent, ... }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema, 'records'); // Points to attendance.records

module.exports = Attendance;

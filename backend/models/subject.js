// models/Subject.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectId: {
    type: Number,
    required: true,
    unique: true
  },
  subjectName: {
    type: String,
    required: true
  },
  facultyIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  }],
  semester: {
    type: String
  },
  department: {
    type: String
  }
});

module.exports = mongoose.model('subject', subjectSchema);

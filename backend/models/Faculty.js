// backend/models/Faculty.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  teacherId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String },
  position: { type: String },
  phoneNumber: { type: String },
  officeLocation: { type: String },
  joinDate: { type: Date, default: Date.now },
  profileImage: { type: String, default: 'default.jpg' },
  isActive: { type: Boolean, default: true }
}, {
  collection: 'faculties', // Optional: ensures the collection name is correct
  timestamps: true
});

// Hash password before saving
facultySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Faculty', facultySchema);

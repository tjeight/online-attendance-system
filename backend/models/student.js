const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  className: String,
  rollNumber: String,
  password: String,
});

studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Use model checking to prevent compilation error
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

module.exports = Student;

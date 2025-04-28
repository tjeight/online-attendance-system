const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const subjectRoutes = require('./routes/subjects');
const attendanceRoutes = require('./routes/attendance');
const adminRoutes = require('./routes/adminRoutes');

// Direct MongoDB connection - using common MongoDB local connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-system';

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection with better error handling
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1); // Exit the process with failure
});

// Debug route
app.get('/api/debug', (req, res) => {
  res.json({ message: 'API is working' });
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);

console.log('Routes registered:');
console.log('- /api/students');
console.log('- /api/faculty');
console.log('- /api/subjects');
console.log('- /api/attendance');
console.log('- /api/admin');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

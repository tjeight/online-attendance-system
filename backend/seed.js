// seed.js - Script to populate sample data in the database
const mongoose = require('mongoose');
const Subject = require('./models/subject');
require('dotenv').config();

const sampleSubjects = [
  {
    subjectId: 101,
    subjectName: 'Cyber Security',
    semester: '2nd',
    department: 'FYMCA'
  },
  {
    subjectId: 102,
    subjectName: 'Java Programming',
    semester: '2nd',
    department: 'FYMCA'
  },
  {
    subjectId: 103,
    subjectName: 'Full Stack Development',
    semester: '2nd',
    department: 'FYMCA'
  },
  {
    subjectId: 104,
    subjectName: 'Research Methodology',
    semester: '2nd',
    department: 'FYMCA'
  },
  {
    subjectId: 105,
    subjectName: 'Software Project Management',
    semester: '2nd',
    department: 'FYMCA'
  },
  {
    subjectId: 106,
    subjectName: 'Practical Subjects - JAVA, Cyber Security, FSD',
    semester: '2nd',
    department: 'FYMCA'
  },
  {
    subjectId: 107,
    subjectName: 'Placement Training',
    semester: '2nd',
    department: 'FYMCA'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Delete existing subjects
    await Subject.deleteMany({});
    console.log('Cleared existing subjects');
    
    // Insert sample subjects
    await Subject.insertMany(sampleSubjects);
    console.log('Added sample subjects to the database');
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 
// populateTestData.js - Script to populate sample data for testing
const mongoose = require('mongoose');
const Subject = require('./models/subject');
const Student = require('./models/Student');
require('dotenv').config();

const sampleSubjects = [
  {
    subjectId: 101,
    subjectName: 'Introduction to Computer Science',
    semester: '1st',
    department: 'Computer Science'
  },
  {
    subjectId: 102,
    subjectName: 'Data Structures',
    semester: '2nd',
    department: 'Computer Science'
  },
  {
    subjectId: 103,
    subjectName: 'Database Management Systems',
    semester: '3rd',
    department: 'Computer Science'
  },
  {
    subjectId: 201,
    subjectName: 'Calculus I',
    semester: '1st',
    department: 'Mathematics'
  },
  {
    subjectId: 202,
    subjectName: 'Linear Algebra',
    semester: '2nd',
    department: 'Mathematics'
  }
];

const sampleStudents = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    className: 'CS-101',
    password: 'password123'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    className: 'CS-101',
    password: 'password123'
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    className: 'CS-102',
    password: 'password123'
  },
  {
    name: 'Alice Williams',
    email: 'alice@example.com',
    className: 'CS-102',
    password: 'password123'
  },
  {
    name: 'Mike Brown',
    email: 'mike@example.com',
    className: 'Math-201',
    password: 'password123'
  }
];

const populateDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Delete existing data
    await Subject.deleteMany({});
    console.log('Cleared existing subjects');
    
    await Student.deleteMany({});
    console.log('Cleared existing students');
    
    // Insert sample data
    const insertedSubjects = await Subject.insertMany(sampleSubjects);
    console.log('Added sample subjects to the database:', insertedSubjects.length);
    
    const insertedStudents = await Student.insertMany(sampleStudents);
    console.log('Added sample students to the database:', insertedStudents.length);
    
    console.log('Data population complete');
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
};

populateDatabase(); 
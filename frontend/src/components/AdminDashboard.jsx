import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ onLogout, adminData }) => {
  const [activeTab, setActiveTab] = useState('faculty');
  const [facultyList, setFacultyList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [facultyCount, setFacultyCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data when component mounts or active tab changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'faculty' || activeTab === 'dashboard') {
        const facultyResponse = await axios.get('http://localhost:5000/api/admin/faculty');
        setFacultyList(facultyResponse.data.faculty);
        setFacultyCount(facultyResponse.data.count);
      }
      
      if (activeTab === 'students' || activeTab === 'dashboard') {
        const studentResponse = await axios.get('http://localhost:5000/api/admin/students');
        setStudentList(studentResponse.data.students);
        setStudentCount(studentResponse.data.count);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/admin/faculty/${id}`);
      // Refresh faculty list
      const facultyResponse = await axios.get('http://localhost:5000/api/admin/faculty');
      setFacultyList(facultyResponse.data.faculty);
      setFacultyCount(facultyResponse.data.count);
      alert('Faculty deleted successfully');
    } catch (err) {
      console.error('Error deleting faculty:', err);
      alert('Failed to delete faculty member');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/admin/students/${id}`);
      // Refresh student list
      const studentResponse = await axios.get('http://localhost:5000/api/admin/students');
      setStudentList(studentResponse.data.students);
      setStudentCount(studentResponse.data.count);
      alert('Student deleted successfully');
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student');
    }
  };

  // Dashboard Overview Tab
  const renderDashboard = () => (
    <div className="admin-dashboard-overview">
      <h2>System Overview</h2>
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Faculty</h3>
          <div className="stat-number">{facultyCount}</div>
          <p>Total Registered Faculty</p>
        </div>
        <div className="stat-card">
          <h3>Students</h3>
          <div className="stat-number">{studentCount}</div>
          <p>Total Registered Students</p>
        </div>
      </div>
    </div>
  );

  // Faculty Management Tab
  const renderFacultyTab = () => (
    <div className="admin-faculty-list">
      <h2>Faculty Management</h2>
      {isLoading ? (
        <p>Loading faculty data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="table-heading">
            <p>Total Faculty: {facultyCount}</p>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Teacher ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facultyList.length === 0 ? (
                <tr>
                  <td colSpan="4">No faculty members found</td>
                </tr>
              ) : (
                facultyList.map((faculty) => (
                  <tr key={faculty._id}>
                    <td>{faculty.name}</td>
                    <td>{faculty.email}</td>
                    <td>{faculty.teacherId}</td>
                    <td>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteFaculty(faculty._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );

  // Student Management Tab
  const renderStudentTab = () => (
    <div className="admin-student-list">
      <h2>Student Management</h2>
      {isLoading ? (
        <p>Loading student data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="table-heading">
            <p>Total Students: {studentCount}</p>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Roll Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentList.length === 0 ? (
                <tr>
                  <td colSpan="5">No students found</td>
                </tr>
              ) : (
                studentList.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.className}</td>
                    <td>{student.rollNumber}</td>
                    <td>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteStudent(student._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user-info">
          <p>Welcome, {adminData.username}</p>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="admin-sidebar">
          <button 
            className={`sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'faculty' ? 'active' : ''}`}
            onClick={() => setActiveTab('faculty')}
          >
            Faculty
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
        </div>
        
        <div className="admin-main-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'faculty' && renderFacultyTab()}
          {activeTab === 'students' && renderStudentTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
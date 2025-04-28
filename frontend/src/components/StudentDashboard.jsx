import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StudentDashboard.css';

const StudentDashboard = ({ onLogout, studentData }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [error, setError] = useState(null);
  
  // Create a default profile image using SVG
  const defaultProfileImage = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3e%3ccircle cx='50' cy='40' r='25' fill='%236e8efb'/%3e%3ccircle cx='50' cy='115' r='50' fill='%236e8efb'/%3e%3c/svg%3e";

  // Fetch subjects when attendance tab is activated
  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchSubjects();
    }
  }, [activeTab]);

  // Fetch subjects for the student
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/attendance/student-subjects');
      setSubjects(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Failed to load subjects');
      setLoading(false);
    }
  };

  // Fetch attendance statistics for a specific subject
  const fetchAttendanceStats = async (subjectId) => {
    if (!studentData?._id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/attendance/student-attendance/${studentData._id}/${subjectId}`);
      setAttendanceStats(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching attendance stats:', err);
      setError('Failed to load attendance statistics');
      setLoading(false);
    }
  };

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    fetchAttendanceStats(subject._id);
  };

  // Clear selected subject
  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setAttendanceStats(null);
  };

  const renderProfile = () => {
    if (!studentData) {
      return <div className="loading-message">Loading student information...</div>;
    }
    
    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image">
            <img src={defaultProfileImage} alt="Profile" />
          </div>
          <div className="profile-title">
            <h2>{studentData.name}</h2>
            <p>{studentData.className}</p>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-group">
            <h3>Personal Information</h3>
            <div className="detail-item">
              <span className="detail-label">Student ID:</span>
              <span className="detail-value">{studentData._id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Roll Number:</span>
              <span className="detail-value">{studentData.rollNumber || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{studentData.email}</span>
            </div>
          </div>

          <div className="detail-group">
            <h3>Academic Information</h3>
            <div className="detail-item">
              <span className="detail-label">Class:</span>
              <span className="detail-value">{studentData.className}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAttendance = () => {
    if (loading) {
      return <div className="loading-message">Loading...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    // If a subject is selected, show its attendance stats
    if (selectedSubject) {
      return renderSubjectAttendance();
    }

    // Otherwise show the list of subjects
    return (
      <div className="attendance-container">
        <div className="attendance-header">
          <h2>Subject List</h2>
          <p>Click on a subject to view attendance details</p>
        </div>
        
        {subjects.length === 0 ? (
          <div className="no-data-message">No subjects found</div>
        ) : (
          <div className="subject-list">
            {subjects.map((subject) => (
              <div 
                className="subject-card" 
                key={subject._id} 
                onClick={() => handleSubjectSelect(subject)}
              >
                <h3>{subject.subjectName}</h3>
                <div className="subject-details">
                  <span>Subject Code: {subject.subjectId}</span>
                  {subject.department && <span>Department: {subject.department}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSubjectAttendance = () => {
    if (!selectedSubject || !attendanceStats) {
      return <div className="loading-message">Loading attendance data...</div>;
    }

    const { totalClasses, present, percentage, attendanceDetails } = attendanceStats;

    return (
      <div className="subject-attendance-container">
        <div className="attendance-header">
          <button className="back-button" onClick={handleBackToSubjects}>
            &larr; Back to Subjects
          </button>
          <h2>{selectedSubject.subjectName} Attendance</h2>
        </div>
        
        <div className="attendance-stats">
          <div className="stats-card">
            <div className="stat-item">
              <span className="stat-label">Total Classes</span>
              <span className="stat-value">{totalClasses}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Present</span>
              <span className="stat-value">{present}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Absent</span>
              <span className="stat-value">{totalClasses - present}</span>
            </div>
            <div className="stat-item percentage">
              <span className="stat-label">Attendance Percentage</span>
              <span className={`stat-value ${percentage < 75 ? 'low-attendance' : ''}`}>
                {percentage}%
              </span>
            </div>
          </div>
          
          {attendanceDetails.length > 0 ? (
            <div className="attendance-detail-list">
              <h3>Attendance History</h3>
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Faculty</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceDetails.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>{record.time}</td>
                      <td>{record.facultyName}</td>
                      <td className={`status ${record.present ? 'present' : 'absent'}`}>
                        {record.present ? 'Present' : 'Absent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data-message">No attendance records found</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Student Dashboard</h1>
        </div>
        <button className="logout-button" onClick={onLogout}>
          <span className="logout-icon">🚪</span>
          Logout
        </button>
      </header>
      
      <div className="dashboard-content">
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="tab-icon">👤</span>
            Profile
          </button>
          <button 
            className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <span className="tab-icon">📅</span>
            Attendance
          </button>
        </div>
        
        <div className="dashboard-tab-content">
          {activeTab === 'profile' ? renderProfile() : renderAttendance()}
        </div>
      </div>
      
      <footer className="dashboard-footer">
        <p>© 2023 Online Attendance System - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default StudentDashboard; 
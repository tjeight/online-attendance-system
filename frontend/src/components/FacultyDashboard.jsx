import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FacultyDashboard.css';

const FacultyDashboard = ({ onLogout, facultyData: initialFacultyData }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [facultyData, setFacultyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Attendance-related states
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [displayedSubjects, setDisplayedSubjects] = useState([]);
  const [studentsForSubject, setStudentsForSubject] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [attendanceView, setAttendanceView] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [dateTime, setDateTime] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00'
  });

  useEffect(() => {
    const fetchFacultyProfile = async () => {
      if (!initialFacultyData?.id) {
        setError('No faculty data available');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/faculty/profile?facultyId=${initialFacultyData.id}`);
        setFacultyData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch faculty profile');
        setLoading(false);
        console.error('Error fetching faculty profile:', err);
      }
    };

    fetchFacultyProfile();
  }, [initialFacultyData]);

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAllSubjects();
    }
  }, [activeTab]);

  const fetchAllSubjects = async () => {
    try {
      console.log('Fetching subjects...');
      const response = await axios.get('http://localhost:5000/api/subjects');
      console.log('Subjects response:', response);
      
      if (response.data && Array.isArray(response.data)) {
        setAllSubjects(response.data);
        console.log('Fetched subjects:', response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid subjects data format');
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Failed to fetch subjects: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSubjectSelect = (e) => {
    const subjectId = e.target.value;
    console.log('Selected subject ID:', subjectId);
    
    if (!subjectId) {
      console.log('Empty subject ID selected');
      return;
    }
    
    const subject = allSubjects.find(s => s._id === subjectId);
    console.log('Found subject:', subject);
    
    if (subject) {
      if (!selectedSubjects.some(s => s._id === subject._id)) {
        console.log('Adding subject to selected list:', subject);
        setSelectedSubjects([...selectedSubjects, subject]);
        setDisplayedSubjects([...displayedSubjects, subject]);
      } else {
        console.log('Subject already selected:', subject);
      }
    } else {
      console.error('Could not find subject with ID:', subjectId);
    }
  };

  const handleRemoveSubject = (subjectId) => {
    setSelectedSubjects(selectedSubjects.filter(subject => subject._id !== subjectId));
    setDisplayedSubjects(displayedSubjects.filter(subject => subject._id !== subjectId));
  };

  const handleAddAttendance = async (subject) => {
    try {
      setCurrentSubject(subject);
      const response = await axios.get(`http://localhost:5000/api/attendance/students-by-subject/${subject._id}`);
      
      // Initialize attendance data
      const initialAttendance = {};
      response.data.forEach(student => {
        initialAttendance[student._id] = false;
      });
      
      setStudentsForSubject(response.data);
      setAttendanceData(initialAttendance);
      setAttendanceView(true);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students for this subject');
    }
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: isPresent
    });
  };

  const handleSubmitAttendance = async () => {
    try {
      // Prepare detailed attendance data
      const attendanceDetails = studentsForSubject.map(student => ({
        studentId: student._id,
        rollNumber: student.rollNumber || 'N/A',
        name: student.name,
        present: attendanceData[student._id] || false
      }));

      await axios.post('http://localhost:5000/api/attendance/mark', {
        facultyId: initialFacultyData.id,
        facultyName: facultyData.name,
        subjectId: currentSubject._id,
        subjectName: currentSubject.subjectName,
        date: dateTime.date,
        timeSlot: dateTime.time,
        attendanceDetails,
        attendance: attendanceData // Keep for backward compatibility
      });
      
      setAttendanceView(false);
      setStudentsForSubject([]);
      setCurrentSubject(null);
      setAttendanceData({});
      
      alert('Attendance marked successfully!');
    } catch (err) {
      console.error('Error marking attendance:', err);
      setError('Failed to mark attendance');
    }
  };

  const renderProfile = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    if (!facultyData) {
      return <div className="error">No faculty data available</div>;
    }

    return (
      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-image">
            <img src={facultyData.profileImage || "https://via.placeholder.com/150"} alt="Profile" />
          </div>
          <div className="profile-info">
            <h2>{facultyData.name}</h2>
            <p className="position">{facultyData.position}</p>
            <p className="department">{facultyData.department}</p>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-group">
            <h3>Personal Information</h3>
            <div className="detail-item">
              <span className="detail-label">Faculty ID:</span>
              <span className="detail-value">{facultyData.teacherId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{facultyData.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{facultyData.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Office:</span>
              <span className="detail-value">{facultyData.officeLocation || 'Not provided'}</span>
            </div>
          </div>

          <div className="detail-group">
            <h3>Academic Information</h3>
            <div className="detail-item">
              <span className="detail-label">Department:</span>
              <span className="detail-value">{facultyData.department}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Position:</span>
              <span className="detail-value">{facultyData.position}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Join Date:</span>
              <span className="detail-value">{facultyData.joinDate || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAttendance = () => {
    if (attendanceView) {
      return (
        <div className="attendance-form">
          <h3>Mark Attendance - {currentSubject?.subjectName}</h3>
          
          <div className="date-time-inputs">
            <div className="input-group">
              <label>Date:</label>
              <input 
                type="date" 
                value={dateTime.date} 
                onChange={(e) => setDateTime({...dateTime, date: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Time Slot:</label>
              <input 
                type="time" 
                value={dateTime.time} 
                onChange={(e) => setDateTime({...dateTime, time: e.target.value})}
              />
            </div>
          </div>
          
          <div className="student-list">
            <table>
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Present</th>
                </tr>
              </thead>
              <tbody>
                {studentsForSubject.map((student) => (
                  <tr key={student._id}>
                    <td>{student.rollNumber || 'N/A'}</td>
                    <td>{student.name}</td>
                    <td>
                      <label className="attendance-toggle">
                        <input 
                          type="checkbox" 
                          checked={attendanceData[student._id] || false}
                          onChange={(e) => handleAttendanceChange(student._id, e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="attendance-actions">
            <button className="cancel-btn" onClick={() => setAttendanceView(false)}>Cancel</button>
            <button className="submit-btn" onClick={handleSubmitAttendance}>Submit Attendance</button>
          </div>
        </div>
      );
    }

    return (
      <div className="attendance-section">
        <h3>Subject Selection</h3>
        <div className="subject-selection">
          {allSubjects.length === 0 ? (
            <div className="no-subjects-message">
              <p>No subjects available. Please check the database connection.</p>
            </div>
          ) : (
            <>
              <p className="subjects-count">Available Subjects: {allSubjects.length}</p>
              <select onChange={handleSubjectSelect} defaultValue="">
                <option value="" disabled>Select a subject</option>
                {allSubjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName} ({subject.subjectId}) - {subject.department}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
        
        <div className="selected-subjects">
          <h3>Selected Subjects</h3>
          {displayedSubjects.length === 0 ? (
            <p>No subjects selected.</p>
          ) : (
            <div className="subject-cards">
              {displayedSubjects.map((subject) => (
                <div className="subject-card" key={subject._id}>
                  <div className="card-header">
                    <h4>{subject.subjectName}</h4>
                    <button 
                      className="remove-btn" 
                      onClick={() => handleRemoveSubject(subject._id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="card-body">
                    <p>Subject ID: {subject.subjectId}</p>
                    {subject.department && <p>Department: {subject.department}</p>}
                    {subject.semester && <p>Semester: {subject.semester}</p>}
                  </div>
                  <div className="card-footer">
                    <button 
                      className="add-attendance-btn"
                      onClick={() => handleAddAttendance(subject)}
                    >
                      Add Attendance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Faculty Dashboard</h1>
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
    </div>
  );
};

export default FacultyDashboard;

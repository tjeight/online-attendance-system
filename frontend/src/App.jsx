import './App.css';
import { useState } from 'react';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import AdminDashboard from './components/AdminDashboard';
import axios from 'axios';

function App() {
  const [activeForm, setActiveForm] = useState(null);
  const [showStudentDashboard, setShowStudentDashboard] = useState(false);
  const [showFacultyDashboard, setShowFacultyDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [adminData, setAdminData] = useState(null);

  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    className: '',
    rollNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    teacherId: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    studentLogin: false,
    facultyLogin: false,
    adminLogin: false,
    studentRegisterPassword: false,
    studentRegisterConfirm: false,
    facultyRegisterPassword: false,
    facultyRegisterConfirm: false
  });

  const [facultyData, setFacultyData] = useState(null);

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleStudentInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFacultyInputChange = (e) => {
    const { name, value } = e.target;
    setFacultyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentRegister = async (e) => {
    e.preventDefault();
    const { name, email, className, rollNumber, password, confirmPassword } = studentForm;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/students/register', {
        name, email, className, rollNumber, password
      });

      alert(res.data.message);
      setStudentForm({ name: '', email: '', className: '', rollNumber: '', password: '', confirmPassword: '' });
      setActiveForm(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Student registration failed");
    }
  };

  const handleFacultyRegister = async (e) => {
    e.preventDefault();
    const { name, email, teacherId, password, confirmPassword } = facultyForm;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/faculty/register', {
        name, email, teacherId, password
      });

      alert(res.data.message);
      setFacultyForm({ name: '', email: '', teacherId: '', password: '', confirmPassword: '' });
      setActiveForm(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Faculty registration failed");
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    
    try {
      const response = await axios.post('http://localhost:5000/api/students/login', {
        email: email.value,
        password: password.value
      });

      if (response.data && response.data.message === 'Login successful') {
        setStudentData(response.data.student);
        setShowStudentDashboard(true);
      } else {
        alert(response.data?.message || 'Invalid login response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.status === 400) {
        alert('Invalid email or password');
      } else {
        alert('Login failed. Please try again later.');
      }
    }
  };

  const handleFacultyLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      alert('Please enter a valid email address');
      return;
    }

    // Password validation
    if (!password.value || password.value.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/faculty/login', {
        email: email.value.trim(),
        password: password.value
      });

      if (response.data && response.data.faculty) {
        setFacultyData(response.data.faculty);
        setShowFacultyDashboard(true);
      } else {
        alert('Invalid login response. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.status === 400) {
        alert('Invalid credentials. Please check your email and password.');
      } else if (!error.response) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Login failed. Please try again later.');
      }
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;
    
    console.log('Attempting admin login with:', {
      username: username.value,
      password: '******'
    });
    
    if (!username.value) {
      alert('Please enter your username');
      return;
    }
    
    try {
      console.log('Sending request to:', 'http://localhost:5000/api/admin/login');
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        username: username.value.trim(),
        password: password.value
      });
      
      console.log('Login response:', response.data);

      if (response.data && response.data.admin) {
        console.log('Login successful, setting admin data');
        setAdminData(response.data.admin);
        setShowAdminDashboard(true);
      } else {
        alert('Invalid login response. Please try again.');
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.status === 401) {
        alert('Invalid credentials. Please check your username and password.');
      } else {
        alert('Login failed. Please try again later.');
      }
    }
  };

  const handleLogout = () => {
    setShowStudentDashboard(false);
    setShowFacultyDashboard(false);
    setShowAdminDashboard(false);
    setActiveForm(null);
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'student-login':
        return (
          <form className="auth-form" onSubmit={handleStudentLogin}>
            <h3>Student Login</h3>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword.studentLogin ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('studentLogin')}>
                  {showPassword.studentLogin ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="form-button">Login</button>
              <button type="button" className="form-button secondary" onClick={() => setActiveForm(null)}>Back</button>
            </div>
          </form>
        );

      case 'faculty-login':
        return (
          <form className="auth-form" onSubmit={handleFacultyLogin}>
            <h3>Faculty Login</h3>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword.facultyLogin ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('facultyLogin')}>
                  {showPassword.facultyLogin ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="form-button">Login</button>
              <button type="button" className="form-button secondary" onClick={() => setActiveForm(null)}>Back</button>
            </div>
          </form>
        );

      case 'admin-login':
        return (
          <form className="auth-form" onSubmit={handleAdminLogin}>
            <h3>Admin Login</h3>
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="username" placeholder="Enter admin username" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword.adminLogin ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('adminLogin')}>
                  {showPassword.adminLogin ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="form-button">Login</button>
              <button type="button" className="form-button secondary" onClick={() => setActiveForm(null)}>Back</button>
            </div>
          </form>
        );

      case 'student-register':
        return (
          <form className="auth-form" onSubmit={handleStudentRegister}>
            <h3>Student Registration</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={studentForm.name} onChange={handleStudentInputChange} placeholder="Enter your name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={studentForm.email} onChange={handleStudentInputChange} placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Class</label>
              <input type="text" name="className" value={studentForm.className} onChange={handleStudentInputChange} placeholder="Enter your class" required />
            </div>
            <div className="form-group">
              <label>Roll Number</label>
              <input type="text" name="rollNumber" value={studentForm.rollNumber} onChange={handleStudentInputChange} placeholder="Enter your roll number" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword.studentRegisterPassword ? "text" : "password"}
                  name="password"
                  value={studentForm.password}
                  onChange={handleStudentInputChange}
                  placeholder="Enter password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('studentRegisterPassword')}>
                  {showPassword.studentRegisterPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-field">
                <input
                  type={showPassword.studentRegisterConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={studentForm.confirmPassword}
                  onChange={handleStudentInputChange}
                  placeholder="Confirm password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('studentRegisterConfirm')}>
                  {showPassword.studentRegisterConfirm ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="form-button">Register</button>
              <button type="button" className="form-button secondary" onClick={() => setActiveForm(null)}>Back</button>
            </div>
          </form>
        );

      case 'faculty-register':
        return (
          <form className="auth-form" onSubmit={handleFacultyRegister}>
            <h3>Faculty Registration</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={facultyForm.name} onChange={handleFacultyInputChange} placeholder="Enter your name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={facultyForm.email} onChange={handleFacultyInputChange} placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Teacher ID</label>
              <input type="text" name="teacherId" value={facultyForm.teacherId} onChange={handleFacultyInputChange} placeholder="Enter your Teacher ID" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword.facultyRegisterPassword ? "text" : "password"}
                  name="password"
                  value={facultyForm.password}
                  onChange={handleFacultyInputChange}
                  placeholder="Enter password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('facultyRegisterPassword')}>
                  {showPassword.facultyRegisterPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-field">
                <input
                  type={showPassword.facultyRegisterConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={facultyForm.confirmPassword}
                  onChange={handleFacultyInputChange}
                  placeholder="Confirm password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('facultyRegisterConfirm')}>
                  {showPassword.facultyRegisterConfirm ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="form-button">Register</button>
              <button type="button" className="form-button secondary" onClick={() => setActiveForm(null)}>Back</button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  if (showStudentDashboard) return <StudentDashboard onLogout={handleLogout} studentData={studentData} />;
  if (showFacultyDashboard) return <FacultyDashboard onLogout={handleLogout} facultyData={facultyData} />;
  if (showAdminDashboard) return <AdminDashboard onLogout={handleLogout} adminData={adminData} />;

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="header">
          <h1>Online Attendance System</h1>
          <p>Easily manage your attendance records</p>
        </div>

        <div className="auth-container">
          <div className="auth-box">
            {!activeForm ? (
              <>
                <h2>Welcome</h2>
                <p>Please login or register to continue</p>
                <div className="button-group">
                  <button className="main-button" onClick={() => setActiveForm('student-login')}>👨‍🎓 Student Login</button>
                  <button className="main-button" onClick={() => setActiveForm('faculty-login')}>👨‍🏫 Faculty Login</button>
                  <button className="main-button admin" onClick={() => setActiveForm('admin-login')}>👨‍💼 Admin</button>
                  <button className="main-button register" onClick={() => setActiveForm('student-register')}>✏️ Student Register</button>
                  <button className="main-button register" onClick={() => setActiveForm('faculty-register')}>✏️ Faculty Register</button>
                </div>
              </>
            ) : renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

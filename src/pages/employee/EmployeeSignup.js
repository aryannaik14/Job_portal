import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api';
import SkillsInput from '../../components/Skillsinput.js';

// --- CSS Styles ---
const styles = `
    .signup-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        padding: 2rem 1rem;
    }

    .signup-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        width: 100%;
        max-width: 500px;
        overflow: hidden;
    }

    .card-header {
        padding: 2rem;
        text-align: center;
        border-bottom: 1px solid #f3f4f6;
    }

    .card-title {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
    }

    .card-subtitle {
        color: #6b7280;
        font-size: 1rem;
        margin: 0;
    }

    .signup-form {
        padding: 2rem;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0 1.5rem;
    }

    @media (min-width: 640px) {
        .form-grid {
            grid-template-columns: 1fr 1fr;
        }
        .full-width {
            grid-column: 1 / -1;
        }
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
        font-size: 0.9rem;
    }

    .form-input, .form-select, .form-textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.2s ease;
        background: white;
        box-sizing: border-box;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .form-select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
    }

    .submit-btn {
        width: 100%;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-top: 1rem;
    }

    .submit-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px -3px rgba(102, 126, 234, 0.3);
    }
    
    .message {
        text-align: center;
        padding: 0.75rem;
        margin: 0 2rem 1.5rem 2rem;
        border-radius: 8px;
        font-weight: 500;
    }
    .message.success { color: #166534; background-color: #dcfce7; }
    .message.error { color: #991b1b; background-color: #fee2e2; }

    .links {
        text-align: center;
        padding: 0 2rem 2rem 2rem;
        color: #6b7280;
        font-size: 0.9rem;
    }
`;

function EmployeeSignup() {
  const [formData, setFormData] = useState({
    email: '', name: '', password: '', course: '', skills: [], college_info: '',
    school_info: '', cgpa: '', hsc_percent: '', ssc_percent: '', experience: '',
    profile_photo: '', gender: ''
  });
  const [colleges, setColleges] = useState([]);
  const [schools, setSchools] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchColleges();
    fetchSchools();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await API.get('/colleges');
      setColleges(response.data);
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await API.get('/schools');
      setSchools(response.data);
    } catch (error) {
      console.error('Failed to fetch schools:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      const response = await API.post('/signup/employee', formData);
      setMessage('Registration successful! Please login.');
      setIsError(false);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
      setIsError(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="signup-container">
        <div className="signup-card">
          <div className="card-header">
            <h1 className="card-title">Create an Account</h1>
            <p className="card-subtitle">Join our network of professionals.</p>
          </div>
          
          {message && <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>}
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Full Name</label><input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group"><label className="form-label">Email Address</label><input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group full-width"><label className="form-label">Password</label><input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group"><label className="form-label">Course</label><input type="text" name="course" placeholder="B.Tech CSE" value={formData.course} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group"><label className="form-label">CGPA</label><input type="number" name="cgpa" placeholder="e.g., 8.5" step="0.01" min="0" max="10" value={formData.cgpa} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group full-width"><label className="form-label">Skills</label><SkillsInput skills={formData.skills} setSkills={(skills) => setFormData({...formData, skills})} /></div>
              <div className="form-group"><label className="form-label">College</label><select name="college_info" value={formData.college_info} onChange={handleChange} required className="form-select"><option value="">Select College</option>{colleges.map((c, i) => (<option key={i} value={c}>{c}</option>))}</select></div>
              <div className="form-group"><label className="form-label">School</label><select name="school_info" value={formData.school_info} onChange={handleChange} required className="form-select"><option value="">Select School</option>{schools.map((s, i) => (<option key={i} value={s}>{s}</option>))}</select></div>
              <div className="form-group"><label className="form-label">HSC %</label><input type="number" name="hsc_percent" placeholder="e.g., 92.5" step="0.01" min="0" max="100" value={formData.hsc_percent} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group"><label className="form-label">SSC %</label><input type="number" name="ssc_percent" placeholder="e.g., 95.0" step="0.01" min="0" max="100" value={formData.ssc_percent} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group"><label className="form-label">Gender</label><select name="gender" value={formData.gender} onChange={handleChange} required className="form-select"><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
              <div className="form-group"><label className="form-label">Profile Photo URL</label><input type="url" name="profile_photo" placeholder="https://..." value={formData.profile_photo} onChange={handleChange} className="form-input"/></div>
              <div className="form-group full-width"><label className="form-label">Experience (Optional)</label><textarea name="experience" placeholder="Briefly describe your work experience..." value={formData.experience} onChange={handleChange} className="form-textarea"></textarea></div>
              <div className="form-group full-width"><button type="submit" className="submit-btn">Sign Up</button></div>
            </div>
          </form>
          
          <div className="links">
            <p>Already have an account? <Link to="/employee/login">Login</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeSignup;
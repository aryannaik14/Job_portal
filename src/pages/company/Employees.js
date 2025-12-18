import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api';

// --- CSS Styles ---
const styles = `
    .employees-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    }

    .content-wrapper {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .page-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .page-title {
        margin: 0 0 1rem 0;
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
    }
    
    .filter-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .filter-form {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        align-items: flex-end;
    }

    @media (min-width: 768px) {
        .filter-form {
            grid-template-columns: repeat(3, 1fr) auto;
        }
    }

    .form-group {
        width: 100%;
    }

    .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
        font-size: 0.9rem;
    }

    .form-input, .form-select {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.2s ease;
        box-sizing: border-box;
    }

    .form-input:focus, .form-select:focus {
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
    
    .search-btn {
        width: 100%;
        padding: 0.75rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }

    .search-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px -3px rgba(102, 126, 234, 0.4);
    }
    
    .section-title {
        font-size: 1.8rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
    }
    
    .employees-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    
    .employee-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    
    .card-body {
        padding: 1.5rem;
        flex-grow: 1;
    }
    
    .profile-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .profile-photo {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .employee-name {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
    }
    
    .employee-email {
        font-size: 0.9rem;
        color: #6b7280;
        margin: 0;
    }
    
    .detail-item { margin-bottom: 0.75rem; }
    .detail-item strong { color: #4b5563; font-weight: 600; }
    
    .skill-tag {
        background: #eef2ff;
        color: #4338ca;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        display: inline-block;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .card-footer {
        padding: 1rem 1.5rem;
        background-color: #f9fafb;
        border-top: 1px solid #f3f4f6;
    }
    
    .invite-btn {
        width: 100%;
        padding: 0.75rem 1.5rem;
        background: #34d399;
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .invite-btn:hover {
        background: #10b981;
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem 2rem;
        background: white;
        border-radius: 16px;
        color: #6b7280;
        grid-column: 1 / -1;
    }
`;

function Employees({ user }) {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    skills: '',
    experience: '',
    gender: ''
  });

  useEffect(() => {
    searchEmployees();
  }, []);

  const searchEmployees = async () => {
    try {
      const params = {};
      if (filters.skills) params.skills = filters.skills;
      if (filters.experience) params.experience = filters.experience;
      if (filters.gender) params.gender = filters.gender;
      
      const response = await api.get('/employees/search', { params });
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to search employees:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const sendInvitation = async (employeeId) => {
    try {
      await api.post('/send-invitation', {
        employee_id: employeeId,
        job_title: 'Job Opportunity',
        message: 'We are interested in your profile for a position at our company.'
      });
      alert('Invitation sent successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send invitation');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchEmployees();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="employees-container">
        <Navbar user={user} userType="company" />
        <div className="content-wrapper">
          <header className="page-header">
            <h1 className="page-title">Search Employees</h1>
          </header>

          <div className="filter-card">
            <form onSubmit={handleSearch} className="filter-form">
              <div className="form-group">
                <label className="form-label">Skills</label>
                <input type="text" name="skills" placeholder="e.g., React, Python" value={filters.skills} onChange={handleFilterChange} className="form-input"/>
              </div>
              <div className="form-group">
                <label className="form-label">Experience</label>
                <input type="text" name="experience" placeholder="e.g., 2+ years" value={filters.experience} onChange={handleFilterChange} className="form-input"/>
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" value={filters.gender} onChange={handleFilterChange} className="form-select">
                  <option value="">Any Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                </select>
              </div>
              <button type="submit" className="search-btn">Search</button>
            </form>
          </div>
          
          <h2 className="section-title">Employee Profiles</h2>
          
          <div className="employees-grid">
            {employees.length === 0 ? (
                <div className="empty-state">
                    <p>No employees found matching your criteria.</p>
                </div>
            ) : (
                employees.map((employee) => (
                    <div key={employee._id} className="employee-card">
                        <div className="card-body">
                            <div className="profile-header">
                                {employee.profile_photo && <img src={employee.profile_photo} alt="Profile" className="profile-photo" />}
                                <div>
                                    <h3 className="employee-name">{employee.name}</h3>
                                    <p className="employee-email">{employee.email}</p>
                                </div>
                            </div>
                            <div className="detail-item"><strong>Course:</strong> {employee.course}</div>
                            <div className="detail-item"><strong>CGPA:</strong> {employee.cgpa}</div>
                            <div className="detail-item"><strong>Experience:</strong> {employee.experience || 'N/A'}</div>
                            <div className="detail-item"><strong>Skills:</strong> <div>{employee.skills?.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}</div></div>
                        </div>
                        <div className="card-footer">
                            <button className="invite-btn" onClick={() => sendInvitation(employee._id)}>Send Job Invite</button>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Employees;
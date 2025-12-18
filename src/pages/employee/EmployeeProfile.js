import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../api'; // Replace with actual API module


const SkillsInput = ({ skills, setSkills }) => {
  const [internalSkills, setInternalSkills] = useState(skills.join(', '));
  const handleSkillsChange = (e) => {
    setInternalSkills(e.target.value);
    setSkills(e.target.value.split(',').map(s => s.trim()).filter(Boolean));
  };
  return (
    <input
      type="text"
      className="form-input"
      placeholder="Enter skills separated by commas"
      value={internalSkills}
      onChange={handleSkillsChange}
    />
  );
};


// --- CSS Styles ---
const styles = `
    .profile-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    }

    .content-wrapper {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .page-title {
        text-align: center;
        margin: 0 0 2rem 0;
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
    }

    .card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        overflow: hidden;
    }
    
    .profile-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        border-bottom: 1px solid #f3f4f6;
        text-align: center;
    }
    
    .profile-photo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 1rem;
        border: 4px solid white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .profile-name {
        font-size: 1.8rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
    }
    
    .profile-email {
        color: #6b7280;
        margin: 0.25rem 0 0 0;
    }

    .card-body {
        padding: 2rem;
    }
    
    .profile-details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }
    
    .detail-item strong {
        display: block;
        color: #4b5563;
        font-weight: 600;
        margin-bottom: 0.25rem;
    }
    
    .detail-item span {
        color: #1f2937;
    }
    
    .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0;
        margin: 0;
        list-style: none;
    }
    
    .skill-tag {
        background: #eef2ff;
        color: #4338ca;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .card-footer {
        padding: 1.5rem 2rem;
        background-color: #f9fafb;
        border-top: 1px solid #f3f4f6;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }
    
    .btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px -3px rgba(102, 126, 234, 0.3);
    }
    
    .btn-secondary {
        background: #e5e7eb;
        color: #374151;
    }
    
    .btn-secondary:hover {
        background: #d1d5db;
    }

    /* Form Styles */
    .form-group { margin-bottom: 1.5rem; }
    .form-label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; }
    .form-input, .form-textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.2s ease;
        box-sizing: border-box;
    }
    .form-input:focus, .form-textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    .form-textarea { min-height: 100px; }
    
    .message {
        text-align: center;
        padding: 0.75rem;
        margin-bottom: 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        color: #166534;
        background-color: #dcfce7;
    }
`;

function EmployeeProfile({ user }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await API.get('/employee/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setMessage('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await API.put('/employee/profile', profile);
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (loading || !profile) return <div>Loading...</div>;

  return (
    <>
      <style>{styles}</style>
      <div className="profile-container">
        <Navbar user={user} userType="employee" />
        <div className="content-wrapper">
          <h1 className="page-title">Your Profile</h1>
          
          {message && <p className="message">{message}</p>}

          <div className="card">
            {editing ? (
              // --- EDITING VIEW ---
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="profile-header">
                    <img src={profile.profile_photo} alt="Profile" className="profile-photo" />
                    <div className="form-group" style={{width: '100%', marginBottom: 0}}>
                        <label className="form-label">Profile Photo URL</label>
                        <input type="url" name="profile_photo" value={profile.profile_photo || ''} onChange={handleChange} className="form-input"/>
                    </div>
                </div>
                <div className="card-body profile-details-grid">
                  <div className="form-group"><label className="form-label">Name</label><input type="text" name="name" value={profile.name || ''} onChange={handleChange} className="form-input"/></div>
                  <div className="form-group"><label className="form-label">Email</label><input type="email" name="email" value={profile.email || ''} onChange={handleChange} className="form-input"/></div>
                  <div className="form-group"><label className="form-label">Course</label><input type="text" name="course" value={profile.course || ''} onChange={handleChange} className="form-input"/></div>
                  <div className="form-group"><label className="form-label">CGPA</label><input type="number" name="cgpa" value={profile.cgpa || ''} onChange={handleChange} step="0.01" className="form-input"/></div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}><label className="form-label">Skills</label><SkillsInput skills={profile.skills || []} setSkills={(skills) => setProfile({...profile, skills})} /></div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}><label className="form-label">Experience</label><textarea name="experience" value={profile.experience || ''} onChange={handleChange} className="form-textarea"></textarea></div>
                </div>
                <div className="card-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); fetchProfile(); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            ) : (
              // --- VIEWING VIEW ---
              <>
                <div className="profile-header">
                    <img src={profile.profile_photo} alt="Profile" className="profile-photo" />
                    <h2 className="profile-name">{profile.name}</h2>
                    <p className="profile-email">{profile.email}</p>
                </div>
                <div className="card-body profile-details-grid">
                  <div className="detail-item"><strong>Course</strong><span>{profile.course}</span></div>
                  <div className="detail-item"><strong>CGPA</strong><span>{profile.cgpa}</span></div>
                  <div className="detail-item"><strong>College</strong><span>{profile.college_info}</span></div>
                  <div className="detail-item"><strong>School</strong><span>{profile.school_info}</span></div>
                  <div className="detail-item"><strong>HSC %</strong><span>{profile.hsc_percent}</span></div>
                  <div className="detail-item"><strong>SSC %</strong><span>{profile.ssc_percent}</span></div>
                  <div className="detail-item" style={{gridColumn: '1 / -1'}}><strong>Experience</strong><span>{profile.experience}</span></div>
                  <div className="detail-item" style={{gridColumn: '1 / -1'}}>
                    <strong>Skills</strong>
                    <ul className="skills-list">
                      {profile.skills?.map(skill => <li key={skill} className="skill-tag">{skill}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="card-footer">
                    <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeProfile;
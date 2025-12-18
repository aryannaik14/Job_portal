import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api';

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
    
    .company-logo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 1rem;
        border: 4px solid white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .company-name-title {
        font-size: 1.8rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
    }
    
    .company-email {
        color: #6b7280;
        margin: 0.25rem 0 0 0;
    }

    .card-body {
        padding: 2rem;
    }
    
    .details-grid {
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
    
    .detail-item span, .detail-item a {
        color: #1f2937;
        text-decoration: none;
    }
    
    .detail-item a:hover {
        text-decoration: underline;
        color: #667eea;
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
    .form-input, .form-select, .form-textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.2s ease;
        box-sizing: border-box;
    }
    .form-input:focus, .form-select:focus, .form-textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    .form-textarea { min-height: 100px; }
    
    .form-select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
    }
    
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

function CompanyProfile({ user }) {
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
      const response = await api.get('/company/profile');
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
      await api.put('/company/profile', profile);
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  
  const handleSocialChange = (e) => {
    setProfile({
      ...profile,
      social_links: {
        ...profile.social_links,
        [e.target.name]: e.target.value
      }
    });
  };

  if (loading || !profile) return <div>Loading...</div>;

  return (
    <>
      <style>{styles}</style>
      <div className="profile-container">
        <Navbar user={user} userType="company" />
        <div className="content-wrapper">
          <h1 className="page-title">Company Profile</h1>
          
          {message && <p className="message">{message}</p>}

          <div className="card">
            {editing ? (
              // --- EDITING VIEW ---
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="profile-header">
                    <img src={profile.company_logo} alt="Company Logo" className="company-logo" />
                    <div className="form-group" style={{width: '100%', marginBottom: 0}}>
                        <label className="form-label">Company Logo URL</label>
                        <input type="url" name="company_logo" value={profile.company_logo || ''} onChange={handleChange} className="form-input"/>
                    </div>
                </div>
                <div className="card-body details-grid">
                  <div className="form-group"><label className="form-label">Company Name</label><input type="text" name="company_name" value={profile.company_name || ''} onChange={handleChange} className="form-input"/></div>
                  <div className="form-group"><label className="form-label">Email</label><input type="email" name="email" value={profile.email || ''} onChange={handleChange} className="form-input"/></div>
                  <div className="form-group"><label className="form-label">Industry</label>
                    <select name="industry" value={profile.industry || ''} onChange={handleChange} className="form-select">
                      <option value="">Select Industry</option><option value="IT">IT</option><option value="Finance">Finance</option><option value="Healthcare">Healthcare</option><option value="Education">Education</option><option value="Manufacturing">Manufacturing</option><option value="Retail">Retail</option><option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Headquarters</label><input type="text" name="headquarters" value={profile.headquarters || ''} onChange={handleChange} className="form-input"/></div>
                  <div className="form-group"><label className="form-label">Contact Person</label><input type="text" name="contact_person" value={profile.contact_person || ''} onChange={handleChange} className="form-input"/></div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}><label className="form-label">Description</label><textarea name="description" value={profile.description || ''} onChange={handleChange} className="form-textarea"></textarea></div>
                  <div className="form-group"><label className="form-label">LinkedIn URL</label><input type="url" name="linkedin" value={profile.social_links?.linkedin || ''} onChange={handleSocialChange} className="form-input"/></div>
                  <div className="form-group"><label className="form-label">Twitter URL</label><input type="url" name="twitter" value={profile.social_links?.twitter || ''} onChange={handleSocialChange} className="form-input"/></div>
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
                    <img src={profile.company_logo} alt="Company Logo" className="company-logo" />
                    <h2 className="company-name-title">{profile.company_name}</h2>
                    <p className="company-email">{profile.email}</p>
                </div>
                <div className="card-body details-grid">
                  <div className="detail-item"><strong>Industry</strong><span>{profile.industry}</span></div>
                  <div className="detail-item"><strong>Year Founded</strong><span>{profile.year_founded}</span></div>
                  <div className="detail-item"><strong>Company Type</strong><span>{profile.company_type}</span></div>
                  <div className="detail-item"><strong>Company Size</strong><span>{profile.company_size}</span></div>
                  <div className="detail-item"><strong>Headquarters</strong><span>{profile.headquarters}</span></div>
                  <div className="detail-item"><strong>Contact Person</strong><span>{profile.contact_person}</span></div>
                  <div className="detail-item" style={{gridColumn: '1 / -1'}}><strong>Description</strong><span>{profile.description}</span></div>
                  {profile.social_links?.linkedin && <div className="detail-item"><strong>LinkedIn</strong><a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer">View Profile</a></div>}
                  {profile.social_links?.twitter && <div className="detail-item"><strong>Twitter</strong><a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer">View Profile</a></div>}
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

export default CompanyProfile;
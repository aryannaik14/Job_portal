import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

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
        max-width: 700px; /* Wider card for more fields */
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
    
    .form-textarea {
        resize: vertical;
        min-height: 100px;
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

function CompanySignup() {
  const [formData, setFormData] = useState({
    company_name: '', email: '', password: '', industry: '', description: '',
    year_founded: '', company_type: '', company_size: '', headquarters: '',
    contact_person: '', company_logo: '', social_links: { linkedin: '', twitter: '' }
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      await api.post('/signup/company', formData);
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

  const handleSocialChange = (e) => {
    setFormData({
      ...formData,
      social_links: { ...formData.social_links, [e.target.name]: e.target.value }
    });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="signup-container">
        <div className="signup-card">
          <div className="card-header">
            <h1 className="card-title">Company Registration</h1>
            <p className="card-subtitle">Join our network to find top talent.</p>
          </div>
          
          {message && <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>}
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Company Name</label><input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group"><label className="form-label">Company Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group full-width"><label className="form-label">Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group"><label className="form-label">Industry</label>
                <select name="industry" value={formData.industry} onChange={handleChange} required className="form-select">
                  <option value="">Select Industry</option><option value="IT">IT</option><option value="Finance">Finance</option><option value="Healthcare">Healthcare</option><option value="Education">Education</option><option value="Manufacturing">Manufacturing</option><option value="Retail">Retail</option><option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Company Size</label>
                <select name="company_size" value={formData.company_size} onChange={handleChange} required className="form-select">
                  <option value="">Select Size</option><option value="1-10">1-10 employees</option><option value="11-50">11-50 employees</option><option value="51-200">51-200 employees</option><option value="201-500">201-500 employees</option><option value="500+">500+ employees</option>
                </select>
              </div>
              <div className="form-group full-width"><label className="form-label">Description</label><textarea name="description" placeholder="About the Company" value={formData.description} onChange={handleChange} required className="form-textarea"></textarea></div>
              <div className="form-group"><label className="form-label">Headquarters</label><input type="text" name="headquarters" value={formData.headquarters} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group"><label className="form-label">Contact Person</label><input type="text" name="contact_person" value={formData.contact_person} onChange={handleChange} required className="form-input"/></div>
              <div className="form-group"><label className="form-label">Year Founded</label><input type="number" name="year_founded" placeholder="e.g., 2015" value={formData.year_founded} onChange={handleChange} className="form-input"/></div>
              <div className="form-group"><label className="form-label">Company Logo URL</label><input type="url" name="company_logo" placeholder="https://..." value={formData.company_logo} onChange={handleChange} className="form-input"/></div>
              <div className="form-group"><label className="form-label">LinkedIn URL</label><input type="url" name="linkedin" value={formData.social_links.linkedin} onChange={handleSocialChange} className="form-input"/></div>
              <div className="form-group"><label className="form-label">Twitter URL</label><input type="url" name="twitter" value={formData.social_links.twitter} onChange={handleSocialChange} className="form-input"/></div>
              <div className="form-group full-width"><button type="submit" className="submit-btn">Register Company</button></div>
            </div>
          </form>
          
          <div className="links">
            <p>Already have an account? <Link to="/company/login">Login</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanySignup;
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api';

// --- CSS Styles ---
const styles = `
    .post-job-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    }

    .content-wrapper {
        max-width: 800px;
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

    .card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        overflow: hidden;
    }

    .card-body {
        padding: 2rem;
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0 1.5rem;
    }

    @media (min-width: 768px) {
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
    
    .form-textarea {
        resize: vertical;
        min-height: 120px;
    }
    
    .skills-input-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .skills-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
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

    .submit-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px -3px rgba(102, 126, 234, 0.3);
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

function PostJob({ user }) {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    required_skills: [''],
    required_experience: '',
    min_cgpa: '',
    min_hsc: '',
    min_ssc: '',
    required_course: ''
  });
  const [numSkills, setNumSkills] = useState(1);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredSkills = jobData.required_skills.filter(skill => skill.trim());
      const jobDataToSend = { ...jobData, required_skills: filteredSkills };
      
      await api.post('/jobs', jobDataToSend);
      setMessage('Job posted successfully!');
      setJobData({
        title: '', description: '', required_skills: [''], required_experience: '',
        min_cgpa: '', min_hsc: '', min_ssc: '', required_course: ''
      });
      setNumSkills(1);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to post job');
    }
  };

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...jobData.required_skills];
    newSkills[index] = value;
    setJobData({ ...jobData, required_skills: newSkills });
  };

  const handleNumSkillsChange = (e) => {
    const num = parseInt(e.target.value) || 1;
    setNumSkills(num);
    
    const newSkills = [...jobData.required_skills];
    while (newSkills.length < num) newSkills.push('');
    while (newSkills.length > num) newSkills.pop();
    setJobData({ ...jobData, required_skills: newSkills });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="post-job-container">
        <Navbar user={user} userType="company" />
        <div className="content-wrapper">
          <header className="page-header">
            <h1 className="page-title">Post a New Job</h1>
          </header>

          <div className="card">
            <form onSubmit={handleSubmit} className="card-body">
              {message && <p className="message">{message}</p>}
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Job Title</label>
                  <input type="text" name="title" placeholder="e.g., Senior Frontend Developer" value={jobData.title} onChange={handleChange} required className="form-input"/>
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Job Description</label>
                  <textarea name="description" placeholder="Describe the role and responsibilities..." value={jobData.description} onChange={handleChange} required className="form-textarea"></textarea>
                </div>
                
                <div className="form-group full-width">
                    <label className="form-label">Required Skills</label>
                    <div className="skills-input-container">
                        <label className="form-label" style={{marginBottom: 0}}>Number of skills:</label>
                        <input type="number" min="1" max="20" value={numSkills} onChange={handleNumSkillsChange} className="form-input" style={{width: '6rem'}}/>
                    </div>
                    <div className="skills-grid">
                        {Array.from({ length: numSkills }, (_, index) => (
                            <div key={index}>
                                <input type="text" placeholder={`Skill ${index + 1}`} value={jobData.required_skills[index] || ''} onChange={(e) => handleSkillChange(index, e.target.value)} required className="form-input"/>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group"><label className="form-label">Required Experience</label><input type="text" name="required_experience" placeholder="e.g., 2+ years" value={jobData.required_experience} onChange={handleChange} required className="form-input"/></div>
                <div className="form-group"><label className="form-label">Required Course</label><input type="text" name="required_course" placeholder="e.g., B.Tech CSE" value={jobData.required_course} onChange={handleChange} className="form-input"/></div>
                <div className="form-group"><label className="form-label">Minimum CGPA</label><input type="number" name="min_cgpa" placeholder="e.g., 7.5" step="0.01" min="0" max="10" value={jobData.min_cgpa} onChange={handleChange} className="form-input"/></div>
                <div className="form-group"><label className="form-label">Minimum HSC %</label><input type="number" name="min_hsc" placeholder="e.g., 75" step="0.01" min="0" max="100" value={jobData.min_hsc} onChange={handleChange} className="form-input"/></div>
                <div className="form-group"><label className="form-label">Minimum SSC %</label><input type="number" name="min_ssc" placeholder="e.g., 80" step="0.01" min="0" max="100" value={jobData.min_ssc} onChange={handleChange} className="form-input"/></div>
                
                <div className="form-group full-width">
                    <button type="submit" className="submit-btn">Post Job</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostJob;
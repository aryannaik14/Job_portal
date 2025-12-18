import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../api'; 

// --- CSS Styles ---
const styles = `
    .jobs-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    }

    .content-wrapper {
        max-width: 900px;
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
    
    .filter-bar {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    @media (min-width: 768px) {
        .filter-bar {
            grid-template-columns: 1fr 1fr;
        }
    }

    .form-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.2s ease;
        box-sizing: border-box;
    }

    .form-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .section-title {
        font-size: 1.8rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
    }
    
    .jobs-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .job-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    .job-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
    }
    
    .card-body {
        padding: 1.5rem;
    }
    
    .job-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.25rem 0;
    }
    
    .company-name {
        font-size: 1rem;
        color: #6b7280;
        margin: 0 0 1rem 0;
    }
    
    .job-description {
        color: #4b5563;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }
    
    .details-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    @media (min-width: 640px) {
        .details-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    
    .detail-item strong {
        display: block;
        color: #4b5563;
        font-weight: 600;
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
    }
    
    .skill-tag {
        background: #eef2ff;
        color: #4338ca;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        display: inline-block;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .card-footer {
        padding: 1rem 1.5rem;
        background-color: #f9fafb;
        border-top: 1px solid #f3f4f6;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .posted-date {
        font-size: 0.9rem;
        color: #6b7280;
    }
    
    .apply-btn {
        padding: 0.5rem 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .apply-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px -3px rgba(102, 126, 234, 0.4);
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem 2rem;
        background: white;
        border-radius: 16px;
        color: #6b7280;
    }
`;

function Jobs({ user }) {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, skillsFilter]);

  const fetchJobs = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (skillsFilter) params.skills = skillsFilter;
      const response = await API.get('/jobs', { params });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await API.post(`/jobs/apply/${jobId}`);
      alert('Application submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Application failed');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="jobs-container">
        <Navbar user={user} userType="employee" />
        <div className="content-wrapper">
          <header className="page-header">
            <h1 className="page-title">Find Your Next Opportunity</h1>
          </header>

          <div className="filter-bar">
            <input
              type="text"
              className="form-input"
              placeholder="Search companies or job titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Filter by skills (e.g., React, Python)..."
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
            />
          </div>
          
          <h2 className="section-title">Available Jobs</h2>
          
          <div className="jobs-grid">
            {jobs.length === 0 ? (
              <div className="empty-state">
                <p>No jobs found matching your criteria.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job._id} className="job-card">
                  <div className="card-body">
                    <h3 className="job-title">{job.title}</h3>
                    <p className="company-name">{job.company_name}</p>
                    <p className="job-description">{job.description}</p>
                    
                    <div className="details-grid">
                        <div className="detail-item">
                            <strong>Required Skills</strong>
                            <div>{job.required_skills?.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}</div>
                        </div>
                        <div className="detail-item">
                            <strong>Experience</strong>
                            <span>{job.required_experience}</span>
                        </div>
                        <div className="detail-item">
                            <strong>Min CGPA</strong>
                            <span>{job.min_cgpa}</span>
                        </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <span className="posted-date">Posted: {new Date(job.posted_at).toLocaleDateString()}</span>
                    <button className="apply-btn" onClick={() => handleApply(job._id)}>Apply</button>
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

export default Jobs;
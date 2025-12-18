import React, { useState, useEffect } from 'react';
import API from '../../api';
import Navbar from '../../components/Navbar';

// --- CSS Styles ---
const styles = `
    .connections-container {
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
    .connections-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    @media (min-width: 1024px) {
        .connections-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    .section-title {
        font-size: 1.8rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e5e7eb;
    }
    .card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        margin-bottom: 1.5rem;
        overflow: hidden;
    }
    
    .card-body {
        padding: 1.5rem;
        position: relative;
    }
    
    .applicant-header {
        margin-bottom: 1rem;
    }
    
    .applicant-name {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
    }
    
    .applicant-email {
        font-size: 1rem;
        color: #6b7280;
        margin: 0.25rem 0 0 0;
    }
    
    .detail-item {
        margin-bottom: 1rem;
    }
    
    .detail-item:last-child {
        margin-bottom: 0;
    }
    
    .item-label {
        display: block;
        font-weight: 600;
        color: #4b5563;
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
    }
    
    .item-value {
        color: #1f2937;
    }
    
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        display: inline-block;
    }
    
    .status-pending { background-color: #fef3c7; color: #92400e; }
    .status-reviewed { background-color: #dbeafe; color: #1e40af; }
    .status-accepted { background-color: #dcfce7; color: #166534; }
    
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
    
    .empty-state {
        text-align: center;
        padding: 3rem 2rem;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        color: #6b7280;
    }

    /* Cancel Button Styles */
    .cancel-button {
        background-color: #fca5a5;
        color: #b91c1c;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-top: 1rem;
    }

    .cancel-button:hover {
        background-color: #ef4444;
        color: white;
    }
`;

function CompanyConnections({ user }) {
  const [applications, setApplications] = useState([]);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    fetchApplications();
    fetchInvitations();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await API.get('/company/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await API.get('/company/invitations');
      setInvitations(response.data);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'reviewed': return 'status-reviewed';
      case 'accepted': return 'status-accepted';
      default: return '';
    }
  };

  // --- New Function to Cancel an Application ---
  const handleCancelApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to cancel this application? This action cannot be undone.')) {
      try {
        await API.delete(`/company/applications/${applicationId}`);
        // Refreshes the list of applications after successful deletion
        fetchApplications();
      } catch (error) {
        console.error('Failed to cancel application:', error);
        alert('Failed to cancel application. Please try again.');
      }
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="connections-container">
        <Navbar user={user} userType="company" />
        <div className="content-wrapper">
          <header className="page-header">
            <h1 className="page-title">Job Connections</h1>
          </header>
          <div className="connections-grid">
            {/* Applications Section */}
            <div>
              <h2 className="section-title">Job Applications Received</h2>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app._id} className="card">
                    <div className="card-body">
                      <div className="applicant-header">
                        <h4 className="applicant-name">{app.employee_name}</h4>
                        <p className="applicant-email">{app.employee_email}</p>
                      </div>
                      <div className="detail-item">
                        <span className="item-label">Skills:</span>
                        <div>{app.employee_skills?.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}</div>
                      </div>
                      <div className="detail-item">
                        <span className="item-label">Applied:</span>
                        <span className="item-value">{new Date(app.applied_at).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="item-label">Status:</span>
                        <span className={`status-badge ${getStatusClass(app.status)}`}>{app.status}</span>
                      </div>
                      {/* --- New Cancel Button --- */}
                      <button 
                        onClick={() => handleCancelApplication(app._id)} 
                        className="cancel-button"
                      >
                        Cancel Application
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No applications received yet.</p>
                </div>
              )}
            </div>
            {/* Invitations Section */}
            <div>
              <h2 className="section-title">Invitations Sent</h2>
              {invitations.length > 0 ? (
                invitations.map((invite) => (
                  <div key={invite._id} className="card">
                    <div className="card-body">
                      <div className="applicant-header">
                        <h4 className="applicant-name">{invite.job_title}</h4>
                        <p className="applicant-email">To: {invite.company_name}</p>
                      </div>
                      <div className="detail-item">
                        <span className="item-label">Message:</span>
                        <p className="item-value" style={{ fontStyle: 'italic' }}>{invite.message}</p>
                      </div>
                      <div className="detail-item">
                        <span className="item-label">Sent:</span>
                        <span className="item-value">{new Date(invite.sent_at).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="item-label">Status:</span>
                        <span className={`status-badge ${getStatusClass(invite.status)}`}>{invite.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No invitations sent yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyConnections;
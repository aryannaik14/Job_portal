import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../api'; 

// --- CSS Styles ---
const styles = `
    .connections-container {
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

    .connections-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    @media (min-width: 768px) {
        .connections-grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    .section-title {
        font-size: 1.8rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
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
    }
    
    .card-item {
        margin-bottom: 1rem;
    }
    
    .card-item:last-child {
        margin-bottom: 0;
    }
    
    .item-label {
        font-weight: 600;
        color: #4b5563;
        margin-right: 0.5rem;
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
    }
    
    .status-pending { background-color: #fef3c7; color: #92400e; }
    .status-reviewed { background-color: #dbeafe; color: #1e40af; }
    .status-accepted { background-color: #dcfce7; color: #166534; }
    
    .invitation-header {
        margin-bottom: 1rem;
    }
    
    .company-name {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
    }
    
    .job-title {
        font-size: 1rem;
        color: #6b7280;
        margin: 0.25rem 0 0 0;
    }
    
    .message-text {
        font-style: italic;
        color: #4b5563;
        padding-left: 1rem;
        border-left: 3px solid #e5e7eb;
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem 2rem;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        color: #6b7280;
    }
`;

function JobConnections({ user }) {
  const [applications, setApplications] = useState([]);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    fetchApplications();
    fetchInvitations();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await API.get('/employee/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await API.get('/employee/invitations');
      setInvitations(response.data);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    }
  };
  
  const getStatusClass = (status) => {
      switch(status.toLowerCase()) {
          case 'pending': return 'status-pending';
          case 'reviewed': return 'status-reviewed';
          case 'accepted': return 'status-accepted';
          default: return '';
      }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="connections-container">
        <Navbar user={user} userType="employee" />
        <div className="content-wrapper">
          <header className="page-header">
            <h1 className="page-title">Job Connections</h1>
          </header>

          <div className="connections-grid">
            {/* Applications Section */}
            <div>
              <h2 className="section-title">Your Applications</h2>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app._id} className="card">
                    <div className="card-body">
                        <div className="card-item">
                            <span className="item-label">Applied:</span>
                            <span className="item-value">{new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>
                        <div className="card-item">
                            <span className="item-label">Status:</span>
                            <span className={`status-badge ${getStatusClass(app.status)}`}>{app.status}</span>
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                    <p>No applications yet.</p>
                </div>
              )}
            </div>

            {/* Invitations Section */}
            <div>
              <h2 className="section-title">Company Invitations</h2>
              {invitations.length > 0 ? (
                invitations.map((invite) => (
                  <div key={invite._id} className="card">
                    <div className="card-body">
                      <div className="invitation-header">
                          <h4 className="company-name">{invite.company_name}</h4>
                          <p className="job-title">{invite.job_title}</p>
                      </div>
                      <div className="card-item">
                          <p className="message-text">{invite.message}</p>
                      </div>
                      <div className="card-item">
                          <span className="item-label">Received:</span>
                          <span className="item-value">{new Date(invite.sent_at).toLocaleDateString()}</span>
                      </div>
                       <div className="card-item">
                          <span className="item-label">Status:</span>
                          <span className={`status-badge ${getStatusClass(invite.status)}`}>{invite.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                    <p>No invitations yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobConnections;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

// --- CSS Styles ---
const styles = `
    .main-nav {
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        padding: 1rem 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 1.5rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    }

    .nav-link {
        color: #4b5563;
        text-decoration: none;
        font-weight: 600;
        font-size: 1rem;
        transition: color 0.2s ease;
        padding: 0.5rem 0;
        position: relative;
    }
    
    .nav-link::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 0;
        left: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transition: all 0.3s ease-out;
    }

    .nav-link:hover {
        color: #1f2937;
    }
    
    .nav-link:hover::after {
        width: 100%;
        left: 0;
    }

    .logout-btn {
        background: transparent;
        border: 2px solid #667eea;
        color: #667eea;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-left: 1rem;
    }

    .logout-btn:hover {
        background: #667eea;
        color: white;
    }
`;

function Navbar({ user, userType }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const employeeLinks = [
    { path: "/employee/home", label: "Home" },
    { path: "/employee/resume", label: "Resume Maker" },
    { path: "/employee/assistance", label: "Assistance" },
    { path: "/employee/jobs", label: "Jobs" },
    { path: "/employee/connections", label: "Connections" },
    { path: "/employee/profile", label: "Profile" },
  ];

  const companyLinks = [
    { path: "/company/home", label: "Home" },
    { path: "/company/post-job", label: "Post a Job" },
    { path: "/company/employees", label: "Employees" },
    { path: "/company/connections", label: "Connections" },
    { path: "/company/profile", label: "Profile" },
  ];

  const links = userType === 'employee' ? employeeLinks : companyLinks;

  return (
    <>
        <style>{styles}</style>
        <nav className="main-nav">
            {links.map(link => (
                <Link key={link.path} to={link.path} className="nav-link">{link.label}</Link>
            ))}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
    </>
  );
}

export default Navbar;
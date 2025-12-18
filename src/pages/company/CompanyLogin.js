import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

// --- CSS Styles ---
const styles = `
    .login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        padding: 1rem;
    }

    .login-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        width: 100%;
        max-width: 420px;
        overflow: hidden;
    }

    .card-header {
        padding: 2rem 2rem 1.5rem 2rem;
        text-align: center;
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

    .login-form {
        padding: 0 2rem 2rem 2rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.2s ease;
        background: white;
        box-sizing: border-box;
    }

    .form-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
    }

    .submit-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px -3px rgba(102, 126, 234, 0.3);
    }
    
    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .message {
        text-align: center;
        padding: 0.75rem;
        margin-bottom: 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        color: #991b1b;
        background-color: #fee2e2;
    }

    .links {
        text-align: center;
        margin-top: 1.5rem;
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .links p {
        margin: 0.5rem 0;
    }
    
    .links a {
        color: #667eea;
        font-weight: 600;
        text-decoration: none;
    }
`;

function CompanyLogin({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/login/company', { email, password });
      const sessionResponse = await api.get('/check-session');
      setUser(sessionResponse.data);
      navigate('/company/home');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
        <style>{styles}</style>
        <div className="login-container">
            <div className="login-card">
                <div className="card-header">
                    <h1 className="card-title">Company Login</h1>
                    <p className="card-subtitle">Access your company dashboard.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    {message && <p className="message">{message}</p>}
                    
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Company Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div className="links">
                    <p>
                        Don't have an account? <Link to="/company/signup">Sign Up</Link>
                    </p>
                    <p>
                        Are you an employee? <Link to="/employee/login">Employee Login</Link>
                    </p>
                </div>
            </div>
        </div>
    </>
  );
}

export default CompanyLogin;
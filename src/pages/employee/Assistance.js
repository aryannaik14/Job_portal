import React, { useState } from 'react';
import API from '../../api';
import Navbar from '../../components/Navbar';

// --- CSS Styles ---
const styles = `
    .assistance-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    }

    .content-wrapper {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    /* Page Header */
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

    .page-subtitle {
        color: #6b7280;
        font-size: 1.1rem;
        margin: 0 auto;
        max-width: 600px;
    }

    /* Card Styles */
    .card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        margin-bottom: 2rem;
        overflow: hidden;
    }

    .card-body {
        padding: 2rem;
    }

    /* Form Styles */
    .assistance-form {
        display: flex;
        gap: 1rem;
    }

    .form-input {
        flex-grow: 1;
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

    .submit-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px -3px rgba(102, 126, 234, 0.3);
    }
    
    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    /* Results Section */
    .results-container {
        margin-top: 2rem;
    }
    
    .results-title {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
    }
    
    .suggestions-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .suggestion-item {
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 1rem 1.5rem;
        margin-bottom: 1rem;
        font-size: 1rem;
        color: #374151;
        transition: all 0.2s ease;
    }
    
    .suggestion-item:hover {
        border-color: #d1d5db;
        background-color: #f3f4f6;
    }

    .error-message {
        color: #ef4444;
        text-align: center;
        margin-top: 1rem;
        font-weight: 500;
    }
    
    .loading-text {
        text-align: center;
        margin-top: 2rem;
        color: #6b7280;
        font-weight: 500;
        font-size: 1.1rem;
    }
`;

function Assistance({ user }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSuggestions([]);
    setSubmittedQuery(query);

    try {
      const response = await API.post('/learning-assistance', { query });
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        setSuggestions(response.data.suggestions);
      } else {
        setSuggestions(["No skills gap found or no suggestions returned."]);
      }
    } catch (err) {
      console.error('Failed to get learning suggestions:', err);
      setError('Failed to get learning suggestions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="assistance-container">
        <Navbar user={user} userType="employee" />
        <div className="content-wrapper">
          <header className="page-header">
            <h1 className="page-title">Assistance for Learning</h1>
            <p className="page-subtitle">Enter a job role or skill to discover personalized learning paths and bridge any gaps in your knowledge.</p>
          </header>

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="assistance-form">
                <input
                  type="text"
                  className="form-input"
                  placeholder="E.g., 'React Developer' or 'Project Management'"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                />
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Searching...' : 'Get Learning Path'}
                </button>
              </form>
            </div>
          </div>

          {loading && <p className="loading-text">Generating your personalized learning path...</p>}
          
          {error && <p className="error-message">{error}</p>}

          {suggestions.length > 0 && !loading && (
            <div className="card results-container">
                <div className="card-body">
                    <h2 className="results-title">Learning Suggestions for "{submittedQuery}"</h2>
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className="suggestion-item">{suggestion}</li>
                        ))}
                    </ul>
                </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Assistance;
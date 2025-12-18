import React, { useState } from 'react';

// --- CSS Styles ---
const styles = `
    .skills-input-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        background-color: #f9fafb;
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
    }

    .skills-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
        font-size: 0.9rem;
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
    
    .number-input {
        width: 5rem;
        text-align: center;
    }

    .skills-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    @media (min-width: 640px) {
        .skills-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
`;

function SkillsInput({ skills, setSkills }) {
  const [numSkills, setNumSkills] = useState(skills.length || 1);

  const handleNumSkillsChange = (e) => {
    const num = parseInt(e.target.value) || 1;
    setNumSkills(num);
    
    const newSkills = [...skills];
    while (newSkills.length < num) {
      newSkills.push('');
    }
    while (newSkills.length > num) {
      newSkills.pop();
    }
    setSkills(newSkills);
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="skills-input-container">
        <div className="skills-header">
          <label className="form-label" style={{marginBottom: 0}}>Number of skills:</label>
          <input
            type="number"
            className="form-input number-input"
            min="1"
            max="20"
            value={numSkills}
            onChange={handleNumSkillsChange}
          />
        </div>
        
        <div className="skills-grid">
          {Array.from({ length: numSkills }, (_, index) => (
            <div key={index}>
              <input
                type="text"
                className="form-input"
                placeholder={`Skill ${index + 1}`}
                value={skills[index] || ''}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SkillsInput;
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar';

// --- CSS Styles ---
// All styles are defined here, removing the dependency on Tailwind CSS.
const styles = `
    :root {
        --color-primary: #4f46e5;
        --color-primary-dark: #4338ca;
        --color-primary-light: #e0e7ff;
        --color-primary-text: #3730a3;
        --color-background: #f3f4f6;
        --color-surface: #ffffff;
        --color-text-primary: #1f2937;
        --color-text-secondary: #4b5563;
        --color-border: #d1d5db;
        --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }

    .resume-maker-container {
        font-family: var(--font-sans);
        min-height: 100vh;
        background-color: var(--color-background);
        padding: 2rem;
    }

    .resume-maker-inner {
        max-width: 80rem;
        margin: 0 auto;
    }

    .header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .header h1 {
        font-size: 2.25rem;
        font-weight: bold;
        color: var(--color-text-primary);
    }

    .header p {
        color: var(--color-text-secondary);
        margin-top: 0.5rem;
    }

    .main-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    @media (min-width: 1024px) {
        .main-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    
    .form-section, .preview-section-wrapper {
        background-color: var(--color-surface);
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow);
    }
    
    .preview-section-sticky {
        position: sticky;
        top: 2rem;
    }

    .form-section h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text-primary);
    }
    
    .form-section .section-group {
        border: 1px solid var(--color-border);
        background-color: #f9fafb;
        border-radius: 0.375rem;
        padding: 1rem;
        margin-bottom: 1rem;
        position: relative;
    }
    
    .input-group { margin-bottom: 1rem; }
    .input-group label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 0.25rem; }
    .input-group input, .input-group textarea {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 0.375rem;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .input-group input:focus, .input-group textarea:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 1px var(--color-primary);
    }
    .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    .btn-add {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 0.5rem 1rem;
        border: 1px dashed var(--color-border);
        border-radius: 0.375rem;
        color: var(--color-text-secondary);
        background-color: transparent;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .btn-add:hover { background-color: #f9fafb; }
    .btn-add svg { margin-right: 0.5rem; }

    .btn-remove {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 9999px;
        transition: background-color 0.2s;
    }
    .btn-remove:hover { background-color: #fee2e2; }
    .btn-remove svg { width: 1rem; height: 1rem; color: #ef4444; }

    .btn-download {
        display: flex;
        align-items: center;
        background-color: var(--color-primary);
        color: white;
        font-weight: bold;
        padding: 0.5rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        box-shadow: var(--shadow);
        cursor: pointer;
        transition: all 0.3s;
    }
    .btn-download:hover { background-color: var(--color-primary-dark); transform: scale(1.05); }
    .btn-download:disabled { background-color: #a5b4fc; cursor: not-allowed; transform: none; }
    .btn-download svg { margin-right: 0.5rem; }
    
    .download-wrapper { display: flex; justify-content: flex-end; margin-bottom: 1rem; }

    /* Gemini Feature Styles */
    .description-wrapper {
        position: relative;
    }
    .btn-generate {
        position: absolute;
        bottom: 2.25rem;
        right: 0.5rem;
        display: flex;
        align-items: center;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        background-color: var(--color-primary-light);
        color: var(--color-primary-text);
        border: 1px solid var(--color-primary-light);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
    }
    .btn-generate:hover {
        background-color: #c7d2fe;
        border-color: #c7d2fe;
    }
    .btn-generate:disabled {
        background-color: #e5e7eb;
        color: #9ca3af;
        cursor: not-allowed;
    }
    .btn-generate svg {
        width: 0.875rem;
        height: 0.875rem;
        margin-right: 0.25rem;
    }

    /* Modal Styles */
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal-content {
        background-color: white;
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
        max-width: 400px;
        text-align: center;
    }
    .modal-content p {
        margin-bottom: 1.5rem;
        color: var(--color-text-secondary);
    }
    .modal-content button {
        background-color: var(--color-primary);
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .modal-content button:hover {
        background-color: var(--color-primary-dark);
    }

    /* Resume Preview Styles */
    .resume-preview {
        background-color: var(--color-surface);
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow);
        aspect-ratio: 1 / 1.414; /* A4 aspect ratio */
        overflow: auto;
    }

    .resume-preview header { text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; }
    .resume-preview header h1 { font-size: 1.875rem; font-weight: bold; color: var(--color-text-primary); }
    .resume-preview .contact-info { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 0 1rem; font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 0.5rem; }
    .resume-preview .contact-info a { color: #2563eb; text-decoration: none; }
    .resume-preview .contact-info a:hover { text-decoration: underline; }
    
    .resume-preview section { margin-top: 1.5rem; }
    .resume-preview h2 { font-size: 1.25rem; font-weight: bold; color: var(--color-primary-text); border-bottom: 1px solid var(--color-primary-light); padding-bottom: 0.25rem; margin-bottom: 0.5rem; }
    
    .resume-preview .item { margin-bottom: 1rem; }
    .resume-preview .item-header { display: flex; justify-content: space-between; align-items: baseline; }
    .resume-preview .item-header h3 { font-size: 1rem; font-weight: 600; color: var(--color-text-primary); }
    .resume-preview .item-header p { font-size: 0.75rem; color: var(--color-text-secondary); }
    .resume-preview .item-subheader { font-size: 0.875rem; font-style: italic; color: var(--color-text-secondary); }
    .resume-preview .item-description { font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 0.25rem; white-space: pre-wrap; }

    .skills-container { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .skill-tag { background-color: var(--color-primary-light); color: var(--color-primary-text); font-size: 0.75rem; font-weight: 500; padding: 0.25rem 0.625rem; border-radius: 9999px; }
`;

// --- Helper Components for Icons ---
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> );
const TrashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> );
const DownloadIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> );
const MagicIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg> );
const LoadingSpinner = ({ size = '1.25rem', margin = '0.5rem', color = 'white' }) => (
    <svg style={{ animation: 'spin 1s linear infinite', height: size, width: size, marginRight: margin, color: color }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </svg>
);

// --- Reusable Input Components ---
const InputField = ({ label, ...props }) => ( <div className="input-group"><label>{label}</label><input {...props} /></div> );
const TextAreaField = ({ label, ...props }) => ( <div className="input-group"><label>{label}</label><textarea rows="4" {...props} /></div> );

// --- Simple Modal Component ---
const SimpleModal = ({ message, onClose }) => (
    <div className="modal-backdrop">
        <div className="modal-content">
            <p>{message}</p>
            <button onClick={onClose}>OK</button>
        </div>
    </div>
);

// --- Main Resume Builder Component ---
export default function ResumeMaker({ user }) { // Receive user prop
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, message: '' });
    const [personalInfo, setPersonalInfo] = useState({ name: 'Your Name', email: 'your.email@example.com', phone: '123-456-7890', address: 'Your City, State', linkedin: 'linkedin.com/in/yourprofile' });
    const [experiences, setExperiences] = useState([ { company: 'Tech Solutions Inc.', role: 'Software Engineer', startDate: '2020-01', endDate: 'Present', description: 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software products.', isLoading: false } ]);
    const [education, setEducation] = useState([ { institution: 'University of Technology', degree: 'B.S. in Computer Science', startDate: '2016-09', endDate: '2020-05' } ]);
    const [skills, setSkills] = useState('React, JavaScript, Node.js, HTML, CSS, SQL, Git');
    const resumePreviewRef = useRef();

    useEffect(() => {
        const loadScript = (src) => new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) return resolve();
            const script = document.createElement('script'); script.src = src; script.onload = resolve;
            script.onerror = () => reject(new Error(`Script load error for ${src}`)); document.head.appendChild(script);
        });
        Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
        ]).then(() => setScriptsLoaded(true)).catch(error => console.error("Failed to load PDF generation scripts:", error));
    }, []);

    const handlePersonalInfoChange = (e) => setPersonalInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleExperienceChange = (index, e) => setExperiences(prev => prev.map((exp, i) => i === index ? { ...exp, [e.target.name]: e.target.value } : exp));
    const handleEducationChange = (index, e) => setEducation(prev => prev.map((edu, i) => i === index ? { ...edu, [e.target.name]: e.target.value } : edu));
    const addExperience = () => setExperiences([...experiences, { company: '', role: '', startDate: '', endDate: '', description: '', isLoading: false }]);
    const removeExperience = (index) => setExperiences(experiences.filter((_, i) => i !== index));
    const addEducation = () => setEducation([...education, { institution: '', degree: '', startDate: '', endDate: '' }]);
    const removeEducation = (index) => setEducation(education.filter((_, i) => i !== index));

    const generateDescription = async (index) => {
        const experience = experiences[index];
        if (!experience.role || !experience.company) {
            setModal({ isOpen: true, message: "Please enter a Role and Company before generating a description." });
            return;
        }

        setExperiences(prev => prev.map((exp, i) => i === index ? { ...exp, isLoading: true } : exp));

        const prompt = `Write a professional resume description for a '${experience.role}' at '${experience.company}'. Focus on key responsibilities and achievements, using action verbs. Provide 3-4 bullet points, each on a new line.`;
        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            let response;
            for (let i = 0, delay = 1000; i < 3; i++, delay *= 2) {
                response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (response.ok) break;
                if (i < 2) await new Promise(res => setTimeout(res, delay));
            }

            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            const result = await response.json();
            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                const cleanedText = text.replace(/•/g, '').replace(/\*/g, '').trim();
                setExperiences(prev => prev.map((exp, i) => i === index ? { ...exp, description: cleanedText, isLoading: false } : exp));
            } else {
                throw new Error("No content received from API.");
            }
        } catch (error) {
            console.error("Error generating description:", error);
            setModal({ isOpen: true, message: "Sorry, something went wrong while generating the description." });
            setExperiences(prev => prev.map((exp, i) => i === index ? { ...exp, isLoading: false } : exp));
        }
    };

    const handleDownloadPdf = () => {
        if (!scriptsLoaded || !window.jspdf || !window.html2canvas) { console.error("PDF generation scripts are not ready."); return; }
        const input = resumePreviewRef.current; if (!input) return;
        const { jsPDF } = window.jspdf; const html2canvas = window.html2canvas;
        html2canvas(input, { scale: 2, useCORS: true, logging: false }).then(canvas => {
            const imgData = canvas.toDataURL('image/png'); const a4Width = 595.28; const a4Height = 841.89;
            const canvasAspectRatio = canvas.width / canvas.height; let pdfWidth = a4Width; let pdfHeight = a4Width / canvasAspectRatio;
            if (pdfHeight > a4Height) { pdfHeight = a4Height; pdfWidth = a4Height * canvasAspectRatio; }
            const xOffset = (a4Width - pdfWidth) / 2; const yOffset = (a4Height - pdfHeight) / 2;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            pdf.addImage(imgData, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight); pdf.save('resume.pdf');
        });
    };

    return (
        <>
            <style>{styles}</style>
            {modal.isOpen && <SimpleModal message={modal.message} onClose={() => setModal({ isOpen: false, message: '' })} />}
            <Navbar user={user} userType={user?.user_type} />
            <div className="resume-maker-container">
                <div className="resume-maker-inner">
                    <header className="header"><h1>Resume Maker</h1><p>Create a professional resume in minutes.</p></header>
                    <div className="main-grid">
                        <div className="form-section">
                            <h2>Personal Information</h2>
                            <InputField label="Full Name" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} placeholder="John Doe" />
                            <InputField label="Email" name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} placeholder="john.doe@email.com" type="email" />
                            <InputField label="Phone" name="phone" value={personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="123-456-7890" />
                            <InputField label="Address" name="address" value={personalInfo.address} onChange={handlePersonalInfoChange} placeholder="City, State" />
                            <InputField label="LinkedIn Profile" name="linkedin" value={personalInfo.linkedin} onChange={handlePersonalInfoChange} placeholder="linkedin.com/in/yourprofile" />
                            <h2>Work Experience</h2>
                            {experiences.map((exp, index) => (
                                <div key={index} className="section-group">
                                    <button onClick={() => removeExperience(index)} className="btn-remove"><TrashIcon /></button>
                                    <InputField label="Company" name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} placeholder="Company Name" />
                                    <InputField label="Role / Position" name="role" value={exp.role} onChange={(e) => handleExperienceChange(index, e)} placeholder="Software Engineer" />
                                    <div className="input-row">
                                        <InputField label="Start Date" name="startDate" value={exp.startDate} onChange={(e) => handleExperienceChange(index, e)} type="month" />
                                        <InputField label="End Date" name="endDate" value={exp.endDate} onChange={(e) => handleExperienceChange(index, e)} type="text" placeholder="Present or YYYY-MM" />
                                    </div>
                                    <div className="description-wrapper">
                                        <TextAreaField label="Description" name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} placeholder="Describe your responsibilities..." />
                                        <button onClick={() => generateDescription(index)} disabled={exp.isLoading} className="btn-generate">
                                            {exp.isLoading ? <LoadingSpinner size="0.875rem" margin="0.25rem" color="var(--color-primary-text)" /> : <MagicIcon />}
                                            {exp.isLoading ? 'Generating...' : '✨ Auto-write'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addExperience} className="btn-add"><PlusIcon /> Add Experience</button>
                            <h2 style={{marginTop: '2rem'}}>Education</h2>
                            {education.map((edu, index) => (
                                <div key={index} className="section-group">
                                    <button onClick={() => removeEducation(index)} className="btn-remove"><TrashIcon /></button>
                                    <InputField label="Institution" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} placeholder="University Name" />
                                    <InputField label="Degree / Certificate" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} placeholder="B.S. in Computer Science" />
                                    <div className="input-row">
                                        <InputField label="Start Date" name="startDate" value={edu.startDate} onChange={(e) => handleEducationChange(index, e)} type="month" />
                                        <InputField label="End Date" name="endDate" value={edu.endDate} onChange={(e) => handleEducationChange(index, e)} type="month" />
                                    </div>
                                </div>
                            ))}
                            <button onClick={addEducation} className="btn-add"><PlusIcon /> Add Education</button>
                            <h2 style={{marginTop: '2rem'}}>Skills</h2>
                            <TextAreaField label="Skills" name="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., React, JavaScript" />
                            <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '-0.5rem'}}>Separate skills with a comma.</p>
                        </div>
                        <div className="preview-section-sticky">
                            <div className="download-wrapper">
                                <button onClick={handleDownloadPdf} disabled={!scriptsLoaded} className="btn-download">
                                    {scriptsLoaded ? <DownloadIcon /> : <LoadingSpinner />}
                                    {scriptsLoaded ? 'Download PDF' : 'Loading...'}
                                </button>
                            </div>
                            <div ref={resumePreviewRef} className="resume-preview">
                                <header>
                                    <h1>{personalInfo.name}</h1>
                                    <div className="contact-info">
                                        <span>{personalInfo.email}</span><span>|</span>
                                        <span>{personalInfo.phone}</span><span>|</span>
                                        <span>{personalInfo.address}</span>
                                        {personalInfo.linkedin && ( <><span>|</span><a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer">{personalInfo.linkedin}</a></> )}
                                    </div>
                                </header>
                                <section>
                                    <h2>Work Experience</h2>
                                    {experiences.map((exp, index) => (
                                        <div key={index} className="item">
                                            <div className="item-header"><h3>{exp.role}</h3><p>{exp.startDate} - {exp.endDate}</p></div>
                                            <h4 className="item-subheader">{exp.company}</h4>
                                            <p className="item-description">{exp.description}</p>
                                        </div>
                                    ))}
                                </section>
                                <section>
                                    <h2>Education</h2>
                                    {education.map((edu, index) => (
                                        <div key={index} className="item">
                                            <div className="item-header"><h3>{edu.institution}</h3><p>{edu.startDate} - {edu.endDate}</p></div>
                                            <p className="item-subheader">{edu.degree}</p>
                                        </div>
                                    ))}
                                </section>
                                <section>
                                    <h2>Skills</h2>
                                    <div className="skills-container">
                                        {skills.split(',').map((skill, index) => skill.trim() && ( <span key={index} className="skill-tag">{skill.trim()}</span> ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
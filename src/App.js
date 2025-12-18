import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './api';

// Employee Components
import EmployeeSignup from './pages/employee/EmployeeSignup';
import EmployeeLogin from './pages/employee/EmployeeLogin';
import EmployeeHome from './pages/employee/EmployeeHome';
import ResumeMaker from './pages/employee/ResumeMaker';
import Assistance from './pages/employee/Assistance';
import Jobs from './pages/employee/Jobs';
import JobConnections from './pages/employee/JobConnections';
import EmployeeProfile from './pages/employee/EmployeeProfile';

// Company Components
import CompanySignup from './pages/company/CompanySignup';
import CompanyLogin from './pages/company/CompanyLogin';
import CompanyHome from './pages/company/CompanyHome';
import PostJob from './pages/company/PostJob';
import Employees from './pages/company/Employees';
import CompanyConnections from './pages/company/CompanyConnections';
import CompanyProfile from './pages/company/CompanyProfile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await api.get('/check-session');
      if (response.data.logged_in) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/employee/signup" element={<EmployeeSignup />} />
          <Route path="/employee/login" element={<EmployeeLogin setUser={setUser} />} />
          <Route path="/company/signup" element={<CompanySignup />} />
          <Route path="/company/login" element={<CompanyLogin setUser={setUser} />} />
          
          {/* Employee Routes */}
          {user && user.user_type === 'employee' && (
            <>
              <Route path="/employee/home" element={<EmployeeHome user={user} />} />
              <Route path="/employee/resume" element={<ResumeMaker user={user} />} />
              <Route path="/employee/assistance" element={<Assistance user={user} />} />
              <Route path="/employee/jobs" element={<Jobs user={user} />} />
              <Route path="/employee/connections" element={<JobConnections user={user} />} />
              <Route path="/employee/profile" element={<EmployeeProfile user={user} />} />
            </>
          )}
          
          {/* Company Routes */}
          {user && user.user_type === 'company' && (
            <>
              <Route path="/company/home" element={<CompanyHome user={user} />} />
              <Route path="/company/post-job" element={<PostJob user={user} />} />
              <Route path="/company/employees" element={<Employees user={user} />} />
              <Route path="/company/connections" element={<CompanyConnections user={user} />} />
              <Route path="/company/profile" element={<CompanyProfile user={user} />} />
            </>
          )}
          
          {/* Default redirects */}
          <Route path="/" element={
            user ? 
              <Navigate to={`/${user.user_type}/home`} /> : 
              <Navigate to="/employee/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import About from './components/about/About';
import Profile from './components/profile/Profile';
import FreelancerList from './components/freelancers/FreelancerList';
import FreelancerProfile from './components/freelancers/FreelancerProfile';
import FreelancerDashboard from './components/dashboard/FreelancerDashboard';
import Jobs from './components/jobs/Jobs';
import JobDetail from './components/jobs/JobDetail';
import CreateJob from './components/jobs/CreateJob';
import PostJob from './components/jobs/PostJob';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/freelancers" element={<FreelancerList />} />
              <Route path="/freelancer/:id" element={<FreelancerProfile />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <FreelancerDashboard />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/jobs" element={
                <PrivateRoute>
                  <Jobs />
                </PrivateRoute>
              } />
              <Route path="/jobs/:id" element={
                <PrivateRoute>
                  <JobDetail />
                </PrivateRoute>
              } />
              <Route path="/jobs/create" element={
                <PrivateRoute>
                  <CreateJob />
                </PrivateRoute>
              } />
              <Route path="/post-job" element={
                <PrivateRoute>
                  <PostJob />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

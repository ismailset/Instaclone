import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <main className={user ? 'pt-16' : ''}>
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={user ? <Home /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create" 
            element={user ? <CreatePost /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile/:username" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={user ? "/" : "/login"} />} 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

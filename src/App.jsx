import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Group from './pages/Group';
import { Toaster } from 'react-hot-toast'; // Optional: for nice notifications

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617] selection:bg-blue-500/30">
        {/* Global Cinematic Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/group/:groupId" element={<Group />} />
          </Routes>
        </div>

        {/* Toast notifications for feedback */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;
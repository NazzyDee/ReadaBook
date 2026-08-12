import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StreamPage } from './pages/StreamPage';
import { LoginPage } from './pages/LoginPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StreamPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

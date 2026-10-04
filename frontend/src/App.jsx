import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, Target, FileText } from 'lucide-react';
import Scanner from './pages/Scanner';
import Simulator from './pages/Simulator';
import Logs from './pages/Logs';

function App() {
  const [language, setLanguage] = useState('en');

  const navItems = [
    { path: '/', label: 'Threat Scanner', icon: <LayoutDashboard size={20} /> },
    { path: '/simulator', label: 'Simulation Training', icon: <Target size={20} /> },
    { path: '/logs', label: 'Compliance Logs', icon: <FileText size={20} /> },
  ];

  const languages = [
    { code: 'en', label: 'English (US)' },
    { code: 'es', label: 'Español (ES)' },
    { code: 'fr', label: 'Français (FR)' },
    { code: 'de', label: 'Deutsch (DE)' },
    { code: 'hi', label: 'हिन्दी (HI)' },
    { code: 'mr', label: 'मराठी (MR)' },
  ];

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <Shield color="var(--accent-color)" />
            OmniGuard AI
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="topbar">
            <h1 className="page-title">OmniGuard AI Security Platform</h1>
            
            <select 
              className="lang-select" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </header>

          <div className="content-area">
            <Routes>
              <Route path="/" element={<Scanner language={language} />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/logs" element={<Logs />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

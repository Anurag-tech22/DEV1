import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ShieldCheck, Target, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Scanner from './pages/Scanner';
import Simulator from './pages/Simulator';
import Logs from './pages/Logs';
import BreachMonitor from './pages/BreachMonitor';
import { i18n } from './i18n';
import { Canvas } from '@react-three/fiber';
import CyberScene from './components/CyberScene';

type Lang = keyof typeof i18n;

export default function App() {
  const [language, setLanguage] = useState<Lang>('en');
  const [systemTime, setSystemTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTime(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const t = i18n[language] || i18n.en;

  const navItems = [
    { path: '/', label: t.navScanner, icon: <ShieldCheck size={20} /> },
    { path: '/breach', label: 'Dark Web', icon: <Target size={20} /> },
    { path: '/simulator', label: t.navDrills, icon: <Target size={20} /> },
    { path: '/logs', label: t.navLogs, icon: <FileText size={20} /> },
  ];

  return (
    <BrowserRouter>
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        
        {/* Seamless 3D Cyber Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
            <CyberScene />
          </Canvas>
        </div>

        {/* 2D HTML UI Layer */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', overflowY: 'auto' }}>
          
          {/* HUD Overlay Effects */}
          <div className="hud-brackets pointer-events-none"></div>
          
          <div className="app-container">
            <motion.header 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, letterSpacing: '-1px' }}>
                  {t.appTitle} <span style={{ fontSize: '1rem', color: 'var(--accent)', verticalAlign: 'top' }}>v2.0</span>
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* Futuristic Status Ticker */}
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--safe)', padding: '0.25rem 0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <div style={{ width: '8px', height: '8px', background: 'var(--safe)', borderRadius: '50%' }} />
                    </motion.div>
                    <span style={{ color: 'var(--safe)', fontFamily: 'monospace', fontSize: '0.8rem' }}>SYS_ONLINE: {systemTime}</span>
                  </div>

                  <select 
                    className="lang-select" 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as Lang)}
                  >
                  <option value="en">English (US)</option>
                  <option value="hi">हिन्दी (HI)</option>
                  <option value="mr">मराठी (MR)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                  <option value="de">Deutsch (DE)</option>
                  <option value="zh">中文 (ZH)</option>
                  <option value="ja">日本語 (JA)</option>
                  <option value="ar">العربية (AR)</option>
                  <option value="pt">Português (PT)</option>
                </select>
                </div>
              </div>
              
              <nav className="nav-tabs">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="active-pill"
                            style={{ position: 'absolute', inset: 0, background: 'var(--bg)', borderRadius: '12px', zIndex: -1, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                          />
                        )}
                        <span style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {item.icon}
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </motion.header>

            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Scanner language={language} t={t} />} />
                <Route path="/breach" element={<BreachMonitor t={t} />} />
                <Route path="/simulator" element={<Simulator t={t} />} />
                <Route path="/logs" element={<Logs t={t} />} />
              </Routes>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

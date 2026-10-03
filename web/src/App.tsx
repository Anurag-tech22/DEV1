import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ShieldCheck, Target, FileText, Radio, Volume2, Smartphone, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Scanner from './pages/Scanner';
import Simulator from './pages/Simulator';
import Logs from './pages/Logs';
import BreachMonitor from './pages/BreachMonitor';
import ThreatRadar from './pages/ThreatRadar';
import AudioGuard from './pages/AudioGuard';
import MalwareSandbox from './pages/MalwareSandbox';
import CounterScam from './pages/CounterScam';
import { i18n } from './i18n';
import { Canvas } from '@react-three/fiber';
import CyberScene from './components/CyberScene';

type Lang = keyof typeof i18n;

export default function App() {
  const [language] = useState<Lang>('en');
  const [systemTime, setSystemTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTime(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const t = i18n[language] || i18n.en;

  const navItems = [
    { path: '/', label: t.navScanner || 'Threat Scanner', icon: <ShieldCheck size={18} /> },
    { path: '/radar', label: t.navRadar || 'Threat Radar', icon: <Radio size={18} /> },
    { path: '/audio', label: t.navAudio || 'Audio Guard', icon: <Volume2 size={18} /> },
    { path: '/malware', label: t.navMalware || 'APK Sandbox', icon: <Smartphone size={18} /> },
    { path: '/honeypot', label: t.navHoneypot || 'AI Baitalyzer', icon: <Bot size={18} /> },
    { path: '/breach', label: t.navBreach || 'Dark Web', icon: <Target size={18} /> },
    { path: '/simulator', label: t.navDrills || 'Drills', icon: <Target size={18} /> },
    { path: '/logs', label: t.navLogs || 'SOC Logs', icon: <FileText size={18} /> },
  ];

  return (
    <BrowserRouter>
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000000', color: '#ffffff' }}>
        
        {/* Seamless Cyber Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
            <CyberScene />
          </Canvas>
        </div>

        {/* 2D HTML UI Layer */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', overflowY: 'auto' }}>
          
          {/* HUD Overlay Effects */}
          <div className="hud-brackets pointer-events-none"></div>
          
          <div className="app-container" style={{ maxWidth: '1100px' }}>
            <motion.header 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: '1.75rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '10px', height: '10px', background: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 12px #38bdf8' }} />
                  <h1 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                    {t.appTitle}
                  </h1>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* Futuristic Status Ticker */}
                  <div style={{ background: '#000000', border: '1px solid var(--safe)', padding: '0.3rem 0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <div style={{ width: '8px', height: '8px', background: 'var(--safe)', borderRadius: '50%' }} />
                    </motion.div>
                    <span style={{ color: 'var(--safe)', fontFamily: 'monospace', fontSize: '0.78rem' }}>SYS_ONLINE: {systemTime}</span>
                  </div>

                </div>
              </div>
              
              <nav className="nav-tabs" style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', padding: '0.4rem', background: 'rgba(0, 0, 0, 0.92)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px' }}>
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="active-pill"
                            style={{ position: 'absolute', inset: 0, background: '#000000', border: '1px solid #38bdf8', borderRadius: '12px', zIndex: -1, boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)' }}
                          />
                        )}
                        <span style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.45rem', color: isActive ? '#38bdf8' : '#ffffff' }}>
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
                <Route path="/radar" element={<ThreatRadar />} />
                <Route path="/audio" element={<AudioGuard />} />
                <Route path="/malware" element={<MalwareSandbox />} />
                <Route path="/honeypot" element={<CounterScam />} />
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

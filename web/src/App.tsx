import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ShieldCheck, Target, FileText, Radio, Volume2, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Scanner from './pages/Scanner';
import Simulator from './pages/Simulator';
import Logs from './pages/Logs';
import BreachMonitor from './pages/BreachMonitor';
import ThreatRadar from './pages/ThreatRadar';
import AudioGuard from './pages/AudioGuard';
import MalwareSandbox from './pages/MalwareSandbox';
import { i18n } from './i18n';

type Lang = keyof typeof i18n;

const getCookieLang = (): Lang => {
  const match = document.cookie.match(/googtrans=\/en\/([a-z]{2}(-CN|-TW)?)/i);
  return (match ? match[1] : 'en') as Lang;
};

export default function App() {
  const [language] = useState<Lang>(getCookieLang());

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    if (lang === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
    }
    window.location.reload();
  };


  const t = i18n[language] || i18n.en;

  const navItems = [
    { path: '/', label: t.navScanner || 'Threat Scanner', icon: <ShieldCheck size={18} /> },
    { path: '/radar', label: t.navRadar || 'Threat Radar', icon: <Radio size={18} /> },
    { path: '/audio', label: t.navAudio || 'Audio Guard', icon: <Volume2 size={18} /> },
    { path: '/malware', label: t.navMalware || 'APK Sandbox', icon: <Smartphone size={18} /> },
    { path: '/breach', label: t.navBreach || 'Dark Web', icon: <Target size={18} /> },
    { path: '/simulator', label: t.navDrills || 'Drills', icon: <Target size={18} /> },
    { path: '/logs', label: t.navLogs || 'SOC Logs', icon: <FileText size={18} /> },
  ];

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff' }}>
        
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          
          <div className="app-container" style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', flex: 1 }}>
            <motion.header 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: '1.75rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '10px', height: '10px', background: '#38bdf8', borderRadius: '50%' }} />
                  <h1 style={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                    {t.appTitle}
                  </h1>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* Professional Status Badge */}
                  <div style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '0.3rem 0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--safe)', borderRadius: '50%' }} />
                    <span style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 500 }}>System Operational</span>
                  </div>

                  <select 
                    className="lang-select notranslate" 
                    value={language} 
                    onChange={handleLanguageChange}
                    style={{ background: '#000000', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.25)', fontSize: '0.85rem', padding: '0.4rem 0.8rem', borderRadius: '8px', outline: 'none' }}
                  >
                    <option value="en">English (US)</option>
                    <option value="hi">हिन्दी (HI)</option>
                    <option value="mr">मराठी (MR)</option>
                    <option value="es">Español (ES)</option>
                    <option value="fr">Français (FR)</option>
                    <option value="de">Deutsch (DE)</option>
                    <option value="zh-CN">中文 (ZH)</option>
                    <option value="ja">日本語 (JA)</option>
                    <option value="ar">العربية (AR)</option>
                    <option value="pt">Português (PT)</option>
                  </select>
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
                            style={{ position: 'absolute', inset: 0, background: '#000000', border: '1px solid #38bdf8', borderRadius: '12px', zIndex: -1 }}
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

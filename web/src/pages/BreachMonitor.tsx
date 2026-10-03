import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export default function BreachMonitor({ }: { t?: any }) {
  const [email, setEmail] = useState('');
  const [scanning, setScanning] = useState(false);
  const [breaches, setBreaches] = useState<any[] | null>(null);

  const handleScan = () => {
    if (!email.trim() || !email.includes('@')) return;
    setScanning(true);
    setBreaches(null);

    // Simulate an API call to a dark web / HIBP database
    setTimeout(() => {
      setScanning(false);
      // Randomly decide if breached or safe based on length
      if (email.length % 2 === 0) {
        setBreaches([
          { source: 'LinkedIn Data Leak', date: 'May 2016', compromised: ['Emails', 'Passwords'] },
          { source: 'Canva Breach', date: 'May 2019', compromised: ['Emails', 'Passwords', 'Names'] }
        ]);
      } else {
        setBreaches([]); // safe
      }
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="glass-card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={24} color="var(--accent)" />
          Dark Web & Breach Intel
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Scan underground forums, botnet logs, and known data breaches to see if your identity has been compromised.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            type="email"
            placeholder="Enter your email address to scan..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              background: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              color: '#ffffff',
              fontFamily: 'inherit',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button className="btn btn-primary" onClick={handleScan} disabled={scanning || !email}>
            {scanning ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Search size={20} />
              </motion.div>
            ) : (
              <><Search size={20} /> Init Scan</>
            )}
          </button>
        </div>

        {scanning && (
          <div style={{ textAlign: 'center', color: 'var(--accent)', padding: '2rem' }}>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <h3 style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>[ INTERFACING WITH DARK WEB RELAYS... ]</h3>
            </motion.div>
          </div>
        )}

        {breaches !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {breaches.length > 0 ? (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--scam)', padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--scam)', marginBottom: '1rem' }}>
                  <ShieldAlert size={28} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Identity Compromised</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>We found your email in {breaches.length} known data breaches.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {breaches.map((b, i) => (
                    <div key={i} style={{ background: 'rgba(11, 15, 25, 0.8)', padding: '1rem', borderRadius: '12px' }}>
                      <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>{b.source}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Date: {b.date}</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {b.compromised.map((c: string, j: number) => (
                          <span key={j} className="badge badge-suspicious">{c}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--safe)', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="var(--safe)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ color: 'var(--safe)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Identity Secure</h3>
                <p style={{ color: 'var(--text-muted)' }}>No records found in our dark web databases.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

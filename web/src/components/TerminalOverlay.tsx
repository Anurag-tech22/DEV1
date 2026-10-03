import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const logLines = [
  "[SYSTEM] Rerouting encrypted packets via proxy 0x8F9B...",
  "[KERNEL] Deep-packet inspection active. 0 threats found.",
  "[NET] Incoming transmission from unknown origin. Blocking...",
  "[AI] Heuristic analysis complete. No structural anomalies.",
  "[AUTH] Handshake verified with Node_73.",
  "[WARN] Port 22 scanner detected. IP logged to global blacklist.",
  "[SYSTEM] Memory dump secured. Cipher initialized.",
  "[DB] Indexing 4,021 new dark web signatures...",
  "[SCAN] Target acquired. Performing localized vulnerability assessment...",
  "[NET] Connection closed by foreign host."
];

export default function TerminalOverlay() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const addLog = () => {
      const newLine = logLines[Math.floor(Math.random() * logLines.length)];
      const timestamp = new Date().toISOString().substring(11, 23);
      setLogs(prev => [...prev, `${timestamp} ${newLine}`].slice(-6)); // keep last 6 lines
      
      const nextDelay = Math.random() * 2000 + 500;
      setTimeout(addLog, nextDelay);
    };
    
    addLog();
    return () => {}; // Cleanup not strictly necessary for this infinite mock
  }, []);

  return (
    <div style={{
      position: 'absolute',
      bottom: '1rem',
      left: '1rem',
      width: '450px',
      background: 'rgba(5, 5, 10, 0.6)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderLeft: '3px solid var(--accent)',
      padding: '1rem',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '0.75rem',
      color: 'var(--accent)',
      zIndex: 50,
      backdropFilter: 'blur(4px)',
      pointerEvents: 'none'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(59, 130, 246, 0.3)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 'bold' }}>TERMINAL // LIVE FEED</span>
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>_</motion.span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', height: '100px', overflow: 'hidden' }}>
        {logs.map((log, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {log}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

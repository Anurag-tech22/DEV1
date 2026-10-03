import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface ScanLog {
  ts: number;
  text: string;
  verdict: string;
}

interface DrillLog {
  ts: number;
  scenario: string;
  passed: boolean;
}

export default function Logs({ t }: { t: any }) {
  const [scans, setScans] = useState<ScanLog[]>([]);
  const [drills, setDrills] = useState<DrillLog[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/history');
      setScans(res.data.verdicts);
      setDrills(res.data.drills);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleWipe = async () => {
    if (confirm('WARNING: Purge all audit logs?')) {
      await axios.delete('/api/all');
      fetchLogs();
    }
  };

  const formatDate = (ts: number) => new Date(ts * 1000).toLocaleString();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>{t.auditLogs}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{t.systemLogging}</p>
          </div>
          <button className="btn btn-secondary" onClick={handleWipe} style={{ color: 'var(--scam)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <Trash2 size={16} /> {t.purgeLogs}
          </button>
        </div>

        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)', fontSize: '1.1rem' }}>{t.recentScans}</h3>
        <div style={{ overflowX: 'auto', marginBottom: '3rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t.timestamp}</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t.verdict}</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t.details}</th>
              </tr>
            </thead>
            <tbody>
              {scans.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t.noLogs}</td></tr>
              ) : (
                scans.map((s, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{formatDate(s.ts)}</td>
                    <td style={{ padding: '1rem' }}><span className={`badge badge-${s.verdict}`}>{s.verdict}</span></td>
                    <td style={{ padding: '1rem', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.text}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)', fontSize: '1.1rem' }}>{t.trainingSessions}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t.timestamp}</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t.scenario}</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t.result}</th>
              </tr>
            </thead>
            <tbody>
              {drills.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t.noLogs}</td></tr>
              ) : (
                drills.map((d, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{formatDate(d.ts)}</td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{d.scenario.replace('_', ' ')}</td>
                    <td style={{ padding: '1rem' }}><span className={`badge badge-${d.passed ? 'safe' : 'scam'}`}>{d.passed ? 'Passed' : 'Failed'}</span></td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

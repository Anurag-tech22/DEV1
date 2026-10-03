import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

export default function Logs() {
  const [scans, setScans] = useState([]);
  const [drills, setDrills] = useState([]);

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

  const formatDate = (ts) => new Date(ts * 1000).toLocaleString();

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Audit & Compliance Logs</h2>
          <p style={{ color: 'var(--text-secondary)' }}>System-wide event logging.</p>
        </div>
        <button className="btn btn-secondary" onClick={handleWipe} style={{ color: 'var(--scam-color)', borderColor: 'var(--scam-color)' }}>
          <Trash2 size={16} /> Purge Logs
        </button>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Threat Scans</h3>
      <div style={{ overflowX: 'auto', marginBottom: '3rem' }}>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Verdict</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {scans.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: 'center' }}>No logs available</td></tr>
            ) : (
              scans.map((s, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-secondary)' }}>{formatDate(s.ts)}</td>
                  <td><span className={`badge badge-${s.verdict}`}>{s.verdict}</span></td>
                  <td style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.text}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Training Sessions</h3>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Scenario</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {drills.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: 'center' }}>No logs available</td></tr>
            ) : (
              drills.map((d, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-secondary)' }}>{formatDate(d.ts)}</td>
                  <td style={{ textTransform: 'capitalize' }}>{d.scenario.replace('_', ' ')}</td>
                  <td><span className={`badge badge-${d.passed ? 'safe' : 'scam'}`}>{d.passed ? 'Passed' : 'Failed'}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

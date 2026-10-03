import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function Scanner({ language }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.post('/api/scan', { text, lang: language });
      setResult(res.data);
    } catch (err) {
      setError('Failed to connect to backend server. Ensure it is running.');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (verdict) => {
    if (verdict === 'scam') return <ShieldAlert size={48} color="#ef4444" />;
    if (verdict === 'suspicious') return <AlertTriangle size={48} color="#f59e0b" />;
    return <ShieldCheck size={48} color="#10b981" />;
  };

  return (
    <div>
      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Analyze Communications</h2>
        <textarea
          className="textarea-input"
          placeholder="Paste email, SMS, URL, or UPI request here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => setText('')}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleScan} disabled={loading}>
            {loading ? 'Scanning...' : 'Execute Scan'}
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ borderLeft: '4px solid #ef4444', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {result && (
        <div className="card" style={{ animation: 'fadeIn 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {getIcon(result.verdict)}
            <div>
              <h2 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
                {result.verdict === 'scam' ? 'Critical Threat Detected' : result.verdict}
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Severity Score: {result.score}/100 | Detected Vector: {result.type || 'Generic Text'}
              </p>
            </div>
          </div>

          {result.explain && (
            <div style={{ padding: '1rem', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginBottom: '1.5rem' }}>
              <strong>AI Analysis:</strong> {result.explain}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {result.reasons && result.reasons.length > 0 && (
              <div>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Detection Reasons</h3>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {result.reasons.map((r, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Recommended Actions</h3>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {result.actions.map((a, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Radio, AlertCircle, Link2, QrCode, ShieldAlert, ArrowRight, CheckCircle2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ThreatItem {
  id: string;
  title: string;
  severity: string;
  vector: string;
  target: string;
  sample: string;
  indicators: string[];
}

interface UrlAnalysis {
  url: string;
  hostname: string;
  risk_score: number;
  verdict: string;
  flags: string[];
}

interface UpiAnalysis {
  payee_vpa: string;
  payee_name?: string;
  amount?: string;
  risk_score: number;
  warning: string;
  flags: string[];
}

export default function ThreatRadar({ onTestSample }: { onTestSample?: (text: string) => void }) {
  const [intel, setIntel] = useState<ThreatItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // URL Inspector state
  const [inspectUrl, setInspectUrl] = useState('');
  const [urlResult, setUrlResult] = useState<UrlAnalysis | null>(null);
  const [inspectingUrl, setInspectingUrl] = useState(false);

  // UPI Inspector state
  const [inspectUpi, setInspectUpi] = useState('');
  const [upiResult, setUpiResult] = useState<UpiAnalysis | null>(null);
  const [inspectingUpi, setInspectingUpi] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const res = await axios.get('/api/intel');
        setIntel(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIntel();
  }, []);

  const handleInspectUrl = async () => {
    if (!inspectUrl.trim()) return;
    setInspectingUrl(true);
    setUrlResult(null);
    try {
      const res = await axios.post('/api/url-inspect', { url: inspectUrl.trim() });
      setUrlResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setInspectingUrl(false);
    }
  };

  const handleInspectUpi = async () => {
    if (!inspectUpi.trim()) return;
    setInspectingUpi(true);
    setUpiResult(null);
    try {
      const res = await axios.post('/api/upi-inspect', { query: inspectUpi.trim() });
      setUpiResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setInspectingUpi(false);
    }
  };

  const handleSimulate = (sampleText: string) => {
    if (onTestSample) {
      onTestSample(sampleText);
    }
    navigate('/', { state: { prefill: sampleText } });
  };

  const copySample = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {/* 1. Global Threat Radar Header */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Radio size={28} color="var(--accent)" />
              Global Threat Intelligence Radar
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Real-time zero-day scam campaigns monitored across digital telemetry and open-source intelligence feeds.
            </p>
          </div>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--scam)', padding: '0.4rem 0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--scam)', borderRadius: '50%' }} />
            <span style={{ color: 'var(--scam)', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>5 ACTIVE CAMPAIGNS</span>
          </div>
        </div>

        {/* Live Intel Cards */}
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading live intelligence streams...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {intel.map((t) => (
              <div 
                key={t.id}
                style={{
                  background: '#000000',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--accent)', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                      {t.id}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t.title}</h3>
                  </div>
                  <span className={`badge ${t.severity === 'CRITICAL' ? 'badge-scam' : 'badge-suspicious'}`}>
                    {t.severity}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span>Vector: <strong style={{ color: '#ffffff' }}>{t.vector}</strong></span>
                  <span>Target: <strong style={{ color: '#ffffff' }}>{t.target}</strong></span>
                </div>

                {/* Sample Box */}
                <div style={{ background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '1rem', position: 'relative' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#ffffff', lineHeight: 1.5 }}>
                    "{t.sample}"
                  </p>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {t.indicators.map((ind, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '2px 8px', color: '#d4d4d8' }}>
                        &bull; {ind}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => copySample(t.id, t.sample)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      {copiedId === t.id ? <CheckCircle2 size={14} color="var(--safe)" /> : <Copy size={14} />}
                      {copiedId === t.id ? 'Copied' : 'Copy'}
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleSimulate(t.sample)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Inspect in Scanner <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Deep URL & Domain Inspector Tool */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link2 size={22} color="var(--accent)" />
          Deep Phishing URL & Homoglyph Analyzer
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Inspect suspicious links for spoofed lookalike domains (Punycode / Cyrillic homoglyphs), direct IP host targets, masked shorteners, and high-risk disposable TLDs.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input 
            type="text"
            placeholder="Paste suspicious link (e.g. http://sbi-pan-kyc.top/verify or bit.ly/2xYz)..."
            value={inspectUrl}
            onChange={(e) => setInspectUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInspectUrl()}
          />
          <button className="btn btn-primary" onClick={handleInspectUrl} disabled={inspectingUrl || !inspectUrl}>
            {inspectingUrl ? 'Analyzing...' : 'Deep Inspect'}
          </button>
        </div>

        {urlResult && (
          <div style={{ background: '#000000', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '14px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Hostname:</span>
                <h4 style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#ffffff' }}>{urlResult.hostname}</h4>
              </div>
              <span className={`badge ${urlResult.verdict === 'malicious' ? 'badge-scam' : (urlResult.verdict === 'suspicious' ? 'badge-suspicious' : 'badge-safe')}`}>
                {urlResult.verdict.toUpperCase()} (Risk Score: {urlResult.risk_score}/100)
              </span>
            </div>

            <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Inspection Indicators:</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {urlResult.flags.map((flag, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <AlertCircle size={16} color={urlResult.verdict === 'malicious' ? 'var(--scam)' : 'var(--suspicious)'} />
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 3. QR & UPI Payment Trap Inspector */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <QrCode size={22} color="var(--accent)" />
          QR & UPI Payment Intent Inspector
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Scammers trick victims by sending QR codes claiming "Scan to receive payment". Check any UPI intent string or VPA to verify if it will debit funds from your account.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input 
            type="text"
            placeholder="Paste UPI intent URI (upi://pay?pa=...&pn=...) or VPA (e.g. officer.recovery@okhdfcbank)..."
            value={inspectUpi}
            onChange={(e) => setInspectUpi(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInspectUpi()}
          />
          <button className="btn btn-primary" onClick={handleInspectUpi} disabled={inspectingUpi || !inspectUpi}>
            {inspectingUpi ? 'Verifying...' : 'Analyze UPI'}
          </button>
        </div>

        {upiResult && (
          <div style={{ background: '#000000', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '14px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <ShieldAlert size={28} color={upiResult.risk_score >= 50 ? 'var(--scam)' : 'var(--suspicious)'} />
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Payee VPA: {upiResult.payee_vpa || 'Not Specified'}</h4>
                {upiResult.payee_name && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payee Name: {upiResult.payee_name}</p>}
                {upiResult.amount && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Amount Specified: {upiResult.amount}</p>}
              </div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--scam)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
              <p style={{ color: 'var(--scam)', fontWeight: 600, fontSize: '0.9rem' }}>{upiResult.warning}</p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {upiResult.flags.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d4d4d8' }}>
                  <span>&bull;</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

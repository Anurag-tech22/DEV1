import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, Fingerprint, FileDown, Copy, CheckCircle2, Link, Phone, CreditCard } from 'lucide-react';

interface ScanResult {
  verdict: 'safe' | 'suspicious' | 'scam';
  score: number;
  type: string;
  explain: string;
  reasons: string[];
  actions: string[];
  iocs?: {
    urls: string[];
    phone_numbers: string[];
    upi_ids: string[];
  };
  risk_metrics?: {
    urgency_level: string;
    financial_threat: string;
    coercion_level: string;
    credential_harvest: string;
  };
}

export default function Scanner({ language, t }: { language: string, t: any }) {
  const location = useLocation();
  const [text, setText] = useState<string>((location.state as any)?.prefill || '');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedDossier, setCopiedDossier] = useState(false);

  const handleScan = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post('/api/scan', { 
        text, 
        lang: language
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict === 'scam') return 'var(--scam)';
    if (verdict === 'suspicious') return 'var(--suspicious)';
    return 'var(--safe)';
  };

  const getVerdictIcon = (verdict: string) => {
    if (verdict === 'scam') return <ShieldAlert size={64} color="var(--scam)" />;
    if (verdict === 'suspicious') return <AlertTriangle size={64} color="var(--suspicious)" />;
    return <ShieldCheck size={64} color="var(--safe)" />;
  };

  // Generate formal cybercrime complaint dossier
  const generateDossierText = () => {
    if (!result) return '';
    const now = new Date().toISOString();
    return `================================================================================
KAVACH CYBER DEFENSE - FORENSIC INCIDENT & COMPLAINT DOSSIER
Generated Timestamp: ${now}
Report Classification: CONFIDENTIAL / EVIDENCE GRADE
================================================================================

1. INCIDENT CLASSIFICATION & THREAT ASSESSMENT:
- Threat Verdict: ${result.verdict.toUpperCase()} (Threat Severity Score: ${result.score}/100)
- Attack Vector Category: ${result.type || 'Social Engineering / Digital Fraud'}
- Urgency Rating: ${result.risk_metrics?.urgency_level || 'N/A'}
- Financial Coercion Risk: ${result.risk_metrics?.financial_threat || 'N/A'}
- Statutory Violations: Information Technology Act 2000 (Section 66D: Cheating by Personation), IPC Section 420 (Cheating and Dishonesty)

2. EXTRACTED INDICATORS OF COMPROMISE (IoCs):
- Suspect Phone Numbers / Senders: ${result.iocs?.phone_numbers?.length ? result.iocs.phone_numbers.join(', ') : 'None extracted'}
- Malicious / Phishing URLs: ${result.iocs?.urls?.length ? result.iocs.urls.join(', ') : 'None extracted'}
- Suspect UPI Payment Addresses: ${result.iocs?.upi_ids?.length ? result.iocs.upi_ids.join(', ') : 'None extracted'}

3. ORIGINAL EVIDENTIARY TEXT ARTIFACT:
"""
${text}
"""

4. SYSTEM FORENSIC FINDINGS:
${result.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}

5. RECOMMENDED LAW ENFORCEMENT & REMEDIATION ACTIONS:
${result.actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

================================================================================
For filing online, submit this dossier directly to: https://cybercrime.gov.in
Helpline: National Cyber Crime Helpline (1930)
================================================================================`;
  };

  const handleCopyDossier = () => {
    navigator.clipboard.writeText(generateDossierText());
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2500);
  };

  const handleDownloadDossier = () => {
    const blob = new Blob([generateDossierText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kavach_threat_dossier_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="glass-card">
        <textarea
          placeholder={t.scanPlaceholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setText('')}>
            {t.clearInput}
          </button>
          <button className="btn btn-primary" onClick={handleScan} disabled={loading} style={{ position: 'relative', overflow: 'hidden' }}>
            {loading ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Fingerprint size={20} />
                </motion.div>
                <span style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>ANALYZING...</span>
                
                {/* Cyber Scan Line */}
                <motion.div 
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.8)' }}
                />
              </>
            ) : (
              <><Fingerprint size={20} /> {t.executeScan}</>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card"
            style={{ 
              borderColor: `color-mix(in srgb, ${getVerdictColor(result.verdict)} 50%, transparent)`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
              >
                {getVerdictIcon(result.verdict)}
              </motion.div>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, textTransform: 'capitalize', color: getVerdictColor(result.verdict), marginBottom: '0.25rem' }}>
                  {result.verdict === 'scam' ? t.criticalThreat : result.verdict}
                </h2>
                <div style={{ display: 'flex', gap: '1rem', color: '#ffffff', flexWrap: 'wrap' }}>
                  <span>{t.severityScore}: <strong style={{ color: '#ffffff' }}>{result.score}/100</strong></span>
                  <span>&bull;</span>
                  <span>{t.vector}: <strong style={{ color: '#ffffff' }}>{result.type || 'Generic Text'}</strong></span>
                </div>
              </div>
            </div>

            {/* Multi-Dimensional Threat Vectors */}
            {result.risk_metrics && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Urgency Level</span>
                  <p style={{ fontWeight: 600, color: result.risk_metrics.urgency_level === 'High' ? 'var(--suspicious)' : 'var(--safe)' }}>
                    {result.risk_metrics.urgency_level}
                  </p>
                </div>
                <div style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Financial Threat</span>
                  <p style={{ fontWeight: 600, color: result.risk_metrics.financial_threat === 'Critical' ? 'var(--scam)' : (result.risk_metrics.financial_threat === 'Medium' ? 'var(--suspicious)' : 'var(--safe)') }}>
                    {result.risk_metrics.financial_threat}
                  </p>
                </div>
                <div style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coercion Level</span>
                  <p style={{ fontWeight: 600, color: result.risk_metrics.coercion_level === 'Severe' ? 'var(--scam)' : 'var(--safe)' }}>
                    {result.risk_metrics.coercion_level}
                  </p>
                </div>
                <div style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Credential Harvesting</span>
                  <p style={{ fontWeight: 600, color: result.risk_metrics.credential_harvest === 'Detected' ? 'var(--scam)' : 'var(--safe)' }}>
                    {result.risk_metrics.credential_harvest}
                  </p>
                </div>
              </div>
            )}

            {/* Extracted Indicators of Compromise (IoCs) */}
            {result.iocs && (result.iocs.phone_numbers.length > 0 || result.iocs.urls.length > 0 || result.iocs.upi_ids.length > 0) && (
              <div style={{ background: '#000000', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '14px', padding: '1.25rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                  Extracted Indicators of Compromise (IoCs)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.iocs.phone_numbers.map((phone, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <Phone size={15} color="var(--scam)" />
                      <span style={{ color: 'var(--text-muted)' }}>Suspect Phone:</span>
                      <strong style={{ fontFamily: 'monospace', color: '#ffffff' }}>{phone}</strong>
                    </div>
                  ))}
                  {result.iocs.urls.map((u, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <Link size={15} color="var(--suspicious)" />
                      <span style={{ color: 'var(--text-muted)' }}>Flagged Link:</span>
                      <strong style={{ fontFamily: 'monospace', color: '#ffffff' }}>{u}</strong>
                    </div>
                  ))}
                  {result.iocs.upi_ids.map((upi, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <CreditCard size={15} color="var(--scam)" />
                      <span style={{ color: 'var(--text-muted)' }}>Suspect Payment VPA:</span>
                      <strong style={{ fontFamily: 'monospace', color: '#ffffff' }}>{upi}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.explain && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                style={{ background: '#000000', border: '1px solid rgba(255, 255, 255, 0.2)', borderLeft: '4px solid var(--accent)', padding: '1.5rem', borderRadius: '0 12px 12px 0', marginBottom: '2rem' }}
              >
                <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '0.5rem', fontFamily: 'monospace', letterSpacing: '1px' }}>
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}>█ </motion.span>
                  NEURAL_ENGINE_OUTPUT
                </h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  style={{ lineHeight: 1.6, fontFamily: 'monospace', color: '#ffffff' }}
                >
                  {result.explain}
                </motion.p>
              </motion.div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              {result.reasons.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>{t.detectionFactors}</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {result.reasons.map((r, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                        <span style={{ color: 'var(--suspicious)' }}>&bull;</span> {r}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>{t.recommendedActions}</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.actions.map((a, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                      <span style={{ color: 'var(--safe)' }}>&bull;</span> {a}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Legal Cybercrime Evidence Dossier Export */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Legal Cybercrime Dossier</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generate formal evidence complaint formatted for cybercrime.gov.in / Police reporting.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={handleCopyDossier} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  {copiedDossier ? <CheckCircle2 size={16} color="var(--safe)" /> : <Copy size={16} />}
                  {copiedDossier ? 'Dossier Copied' : 'Copy Dossier'}
                </button>
                <button className="btn btn-primary" onClick={handleDownloadDossier} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <FileDown size={16} /> Download .TXT Report
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, Fingerprint } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Shield3D from '../components/Shield3D';

interface ScanResult {
  verdict: 'safe' | 'suspicious' | 'scam';
  score: number;
  type: string;
  explain: string;
  reasons: string[];
  actions: string[];
}

export default function Scanner({ language, t }: { language: string, t: any }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="glass-card">
        
        {/* 3D Visualizer */}
        <div style={{ height: '200px', width: '100%', marginBottom: '1.5rem', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <Shield3D verdict={loading ? 'suspicious' : (result ? result.verdict : 'idle')} />
            <Environment preset="city" />
          </Canvas>
        </div>

        <textarea
          placeholder={t.scanPlaceholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
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
                  style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.8)', boxShadow: '0 0 8px #fff' }}
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
              borderColor: `color-mix(in srgb, ${getVerdictColor(result.verdict)} 50%, transparent)`,
              boxShadow: `0 8px 32px color-mix(in srgb, ${getVerdictColor(result.verdict)} 10%, transparent)`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', marginBottom: '2rem' }}>
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
                <div style={{ display: 'flex', gap: '1rem', color: '#ffffff' }}>
                  <span>{t.severityScore}: <strong style={{ color: '#ffffff' }}>{result.score}/100</strong></span>
                  <span>&bull;</span>
                  <span>{t.vector}: <strong style={{ color: '#ffffff' }}>{result.type || 'Generic Text'}</strong></span>
                </div>
              </div>
            </div>

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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

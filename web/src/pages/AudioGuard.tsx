import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, ShieldAlert, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface AudioAnalysis {
  verdict: string;
  deepfake_probability: number;
  coercion_pressure: string;
  indicators: string[];
  recommended_action: string;
}

export default function AudioGuard() {
  const [transcript, setTranscript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AudioAnalysis | null>(null);
  const [recording, setRecording] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Audio frequency waveform simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isLive = recording || analyzing;
      const numBars = 36;
      const barWidth = 6;
      const gap = 4;
      const startX = (canvas.width - (numBars * (barWidth + gap))) / 2;

      for (let i = 0; i < numBars; i++) {
        const height = isLive 
          ? Math.sin(phase + i * 0.4) * 25 + Math.cos(phase * 1.5 + i * 0.2) * 20 + 45
          : Math.sin(phase + i * 0.2) * 6 + 14;

        const x = startX + i * (barWidth + gap);
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        if (isLive) {
          gradient.addColorStop(0, '#38bdf8');
          gradient.addColorStop(1, '#6366f1');
        } else {
          gradient.addColorStop(0, '#334155');
          gradient.addColorStop(1, '#1e293b');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 3);
        ctx.fill();
      }

      phase += isLive ? 0.15 : 0.04;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [recording, analyzing]);

  const sampleCalls = [
    {
      title: "🚨 AI Voice Clone: Daughter Emergency",
      text: "Mom it's me! I lost my phone and got into a terrible car accident. The police are going to put me in jail unless you wire money to my lawyer right now! Please don't tell dad!"
    },
    {
      title: "👮 Digital Arrest: CBI Police Extortion",
      text: "This is Inspector Sharma from Central Bureau of Investigation cyber cell. An arrest warrant is issued in your name for money laundering. You are under digital arrest. Stay on this video call and transfer funds to RBI safe account immediately."
    },
    {
      title: "✅ Legitimate Call: Family Verification",
      text: "Hey, just calling to confirm dinner plans for Sunday evening at home. Let me know when you get this."
    }
  ];

  const handleAnalyze = async (textToScan = transcript) => {
    if (!textToScan.trim()) return;
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await axios.post('/api/audio-inspect', {
        transcript: textToScan,
        duration: 12.5
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      setTranscript("Listening for vocal audio input...");
      // Simulate live recording speech recognition
      setTimeout(() => {
        setRecording(false);
        const recognized = "Dad it's me! I'm stuck at the station and my wallet was stolen. Send 15000 to this UPI immediately, don't tell anyone!";
        setTranscript(recognized);
        handleAnalyze(recognized);
      }, 3500);
    } else {
      setRecording(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Volume2 size={28} color="var(--accent)" />
              Audio Guard: AI Voice Cloning & Deepfake Call Inspector
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Acoustic frequency analysis and psychological coercion modeling detecting synthetic speech, voice cloning extortion, and digital arrest threats.
            </p>
          </div>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--accent)', padding: '0.4rem 0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--accent)" />
            <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>ACOUSTIC RADAR ACTIVE</span>
          </div>
        </div>

        {/* Audio Waveform Canvas */}
        <div style={{ background: '#000000', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <canvas ref={canvasRef} width={450} height={90} style={{ width: '100%', maxWidth: '450px', height: '90px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button 
              className={`btn ${recording ? 'btn-secondary' : 'btn-primary'}`} 
              onClick={toggleRecording}
              style={{ background: recording ? '#ef4444' : undefined, color: '#ffffff' }}
            >
              {recording ? <><MicOff size={18} /> Stop Listening</> : <><Mic size={18} /> Record Call / Audio</>}
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {recording ? "🔴 Recording acoustic stream..." : "Or paste call transcript below"}
            </span>
          </div>
        </div>

        {/* Preset Samples */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>Test Scenarios:</span>
          {sampleCalls.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTranscript(s.text);
                handleAnalyze(s.text);
              }}
              style={{
                background: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {s.title}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Paste call transcript, voice note translation, or extortion phone conversation..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          style={{ minHeight: '120px' }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => { setTranscript(''); setResult(null); }}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={() => handleAnalyze()} disabled={analyzing || !transcript}>
            {analyzing ? 'Analyzing Acoustics...' : 'Inspect Audio Call'}
          </button>
        </div>

        {/* Result Breakdown */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            style={{ marginTop: '2rem', background: '#000000', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {result.verdict === 'HIGH_THREAT' ? (
                  <ShieldAlert size={36} color="var(--scam)" />
                ) : result.verdict === 'SUSPICIOUS' ? (
                  <AlertTriangle size={36} color="var(--suspicious)" />
                ) : (
                  <CheckCircle2 size={36} color="var(--safe)" />
                )}
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                    {result.verdict === 'HIGH_THREAT' ? 'HIGH RISK: AI Voice Clone / Extortion Call' : (result.verdict === 'SUSPICIOUS' ? 'SUSPICIOUS: Acoustic & Coercion Markers' : 'CLEAN: Natural Speech Profile')}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coercion Pressure: <strong style={{ color: '#ffffff' }}>{result.coercion_pressure}</strong></p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deepfake Probability</span>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: result.deepfake_probability >= 60 ? 'var(--scam)' : (result.deepfake_probability >= 30 ? 'var(--suspicious)' : 'var(--safe)') }}>
                  {result.deepfake_probability}%
                </h4>
              </div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', borderLeft: '4px solid var(--scam)', padding: '1rem', borderRadius: '0 8px 8px 0', marginBottom: '1.5rem' }}>
              <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.5 }}>
                <strong>Mitigation Advice:</strong> {result.recommended_action}
              </p>
            </div>

            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Acoustic & Psychological Indicators:</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {result.indicators.map((ind, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#ffffff' }}>
                  <span style={{ color: result.verdict === 'HIGH_THREAT' ? 'var(--scam)' : 'var(--suspicious)' }}>&bull;</span> {ind}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

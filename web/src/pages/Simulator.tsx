import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Play, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'bot' | 'system';
  passed?: boolean;
}

export default function Simulator({ t }: { t: any }) {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [chat, setChat] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scenarios = [
    { id: 'phishing', title: 'Corporate Phishing' },
    { id: 'crypto', title: 'Wallet Compromise' },
    { id: 'job_offer', title: 'Recruitment Fraud' },
    { id: 'digital_arrest', title: 'Authority Impersonation' },
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const startDrill = async (scenarioId: string) => {
    setActiveScenario(scenarioId);
    setChat([]);
    setStep(0);
    setFinished(false);
    
    try {
      const res = await axios.post('/api/drill', { scenario: scenarioId, step: 0 });
      setChat([{ text: res.data.line, sender: 'bot' }]);
      setStep(1);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || finished || !activeScenario) return;
    
    const userMsg = input.trim();
    setChat(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    
    try {
      const res = await axios.post('/api/drill', { scenario: activeScenario, step, reply: userMsg });
      if (!res.data.done) {
        setChat(prev => [...prev, { text: res.data.line, sender: 'bot' }]);
        setStep(step + 1);
      } else {
        setChat(prev => [...prev, { text: res.data.debrief, sender: 'system', passed: res.data.passed }]);
        setFinished(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {scenarios.map(s => (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={s.id}
            onClick={() => startDrill(s.id)}
            style={{
              padding: '1.5rem', 
              border: '1px solid', 
              borderColor: activeScenario === s.id ? 'var(--accent)' : 'var(--border)',
              borderRadius: '16px', 
              cursor: 'pointer', 
              textAlign: 'center',
              background: activeScenario === s.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(26, 35, 51, 0.5)'
            }}
          >
            <Play size={24} color={activeScenario === s.id ? 'var(--accent)' : 'var(--text-muted)'} style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontWeight: 600, color: activeScenario === s.id ? 'var(--accent)' : 'var(--text)' }}>{s.title}</div>
          </motion.div>
        ))}
      </div>

      {activeScenario && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '500px', marginTop: '2rem' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chat.map((m, i) => (
              <motion.div 
                initial={{ opacity: 0, x: m.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={i} 
                style={{
                  padding: '1rem 1.25rem', 
                  borderRadius: '16px', 
                  maxWidth: '80%',
                  alignSelf: m.sender === 'user' ? 'flex-end' : (m.sender === 'system' ? 'center' : 'flex-start'),
                  background: m.sender === 'user' ? 'var(--accent)' : (m.sender === 'system' ? (m.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)') : '#000000'),
                  color: m.sender === 'user' ? '#ffffff' : (m.sender === 'system' ? (m.passed ? 'var(--safe)' : 'var(--scam)') : '#ffffff'),
                  border: m.sender === 'system' ? `1px solid ${m.passed ? 'var(--safe)' : 'var(--scam)'}` : '1px solid rgba(255, 255, 255, 0.2)',
                  borderBottomRightRadius: m.sender === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: m.sender === 'bot' ? '4px' : '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                {m.sender === 'system' && (m.passed ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />)}
                {m.text}
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <input 
              type="text" 
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
              placeholder={t.typeResponse}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={finished}
            />
            <button className="btn btn-primary" onClick={handleSend} disabled={finished} style={{ padding: '0 1.5rem' }}>
              <Send size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

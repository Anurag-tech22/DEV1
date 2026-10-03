import React, { useState } from 'react';
import axios from 'axios';
import { Play, Send } from 'lucide-react';

export default function Simulator() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);

  const scenarios = [
    { id: 'phishing', title: 'Corporate Phishing' },
    { id: 'crypto', title: 'Wallet Compromise' },
    { id: 'job_offer', title: 'Recruitment Fraud' },
    { id: 'digital_arrest', title: 'Authority Impersonation' },
  ];

  const startDrill = async (scenarioId) => {
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
    if (!input.trim() || finished) return;
    
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
    <div>
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {scenarios.map(s => (
          <div 
            key={s.id}
            onClick={() => startDrill(s.id)}
            style={{
              padding: '1.5rem', border: '1px solid', borderColor: activeScenario === s.id ? 'var(--accent-color)' : 'var(--border-color)',
              borderRadius: '8px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
              backgroundColor: activeScenario === s.id ? 'rgba(59,130,246,0.1)' : 'transparent'
            }}
          >
            <Play size={24} color={activeScenario === s.id ? 'var(--accent-color)' : 'var(--text-secondary)'} style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 600 }}>{s.title}</div>
          </div>
        ))}
      </div>

      {activeScenario && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chat.map((m, i) => (
              <div 
                key={i} 
                style={{
                  padding: '1rem', borderRadius: '8px', maxWidth: '80%',
                  alignSelf: m.sender === 'user' ? 'flex-end' : (m.sender === 'system' ? 'center' : 'flex-start'),
                  backgroundColor: m.sender === 'user' ? 'var(--accent-color)' : (m.sender === 'system' ? 'transparent' : 'var(--bg-primary)'),
                  color: m.sender === 'user' ? '#fff' : (m.sender === 'system' ? (m.passed ? '#10b981' : '#ef4444') : 'inherit'),
                  border: m.sender === 'system' ? `1px solid ${m.passed ? '#10b981' : '#ef4444'}` : '1px solid var(--border-color)',
                }}
              >
                {m.text}
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <input 
              type="text" 
              className="textarea-input"
              style={{ minHeight: 'auto', margin: 0 }}
              placeholder="Type your response to the threat..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={finished}
            />
            <button className="btn btn-primary" onClick={handleSend} disabled={finished}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

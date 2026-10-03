import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Bot, Send, Clock, UserCheck, Copy, Check, 
  Sparkles, RefreshCw, FileText, ChevronRight
} from 'lucide-react';

interface ChatMessage {
  sender: 'scammer' | 'bait';
  text: string;
  time: string;
}

interface CounterScamResponse {
  persona: string;
  suggested_reply: string;
  strategy: string;
  safety_tip: string;
}

const PERSONAS = [
  {
    id: 'elderly',
    name: '👴 Elderly Grandparent',
    tagline: 'Struggles with glasses, asks for grandson or IFSC code',
    desc: 'Pretends to be slow with technology, continually asking for bank details to write in a paper diary.'
  },
  {
    id: 'tech_naive',
    name: '🤷 Confused Smartphone User',
    tagline: 'Claims app crashed, asks for alternate direct UPI',
    desc: 'Acts eager to pay but keeps getting simulated error screens to extract backup recipient accounts.'
  }
];

const SCAM_STARTERS = [
  {
    title: 'Electricity Shutoff Threat',
    text: 'Dear Consumer, your electricity power will be disconnected at 9:30 PM tonight as last month bill was not updated. Call electricity officer immediately at 9876543210.'
  },
  {
    title: 'CBI Digital Arrest Coercion',
    text: 'This is Officer Sharma from CBI. A parcel with illegal narcotics was seized in your name. Transfer Rs 95,000 to RBI verification account or face non-bailable arrest.'
  },
  {
    title: 'Part-Time Task Deposit Trap',
    text: 'Congratulations! You are selected for YouTube Video Rating Task. To start earning Rs 3000 daily, deposit Rs 1000 registration fee to our merchant UPI ID.'
  }
];

export default function CounterScam() {
  const [persona, setPersona] = useState('elderly');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'scammer',
      text: 'Dear Consumer, your electricity power will be disconnected at 9:30 PM tonight. Download AnyDesk app immediately to update bill or pay fine.',
      time: 'Just now'
    },
    {
      sender: 'bait',
      text: 'Beta, I am opening my bank app on my spectacles, but it is asking for your branch manager\'s name and IFSC code. What is your bank account number so I can ask my grandson?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(145); // Simulated bandwidth wasted counter

  // Live timer for scammer bandwidth wasted
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleSend = async (scammerMsg = inputText) => {
    if (!scammerMsg.trim()) return;

    const newScammerEntry: ChatMessage = {
      sender: 'scammer',
      text: scammerMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newScammerEntry];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const historyPayload = updatedMessages.map(m => ({
        role: m.sender === 'scammer' ? 'scammer' : 'user',
        content: m.text
      }));

      const res = await axios.post<CounterScamResponse>('/api/counter-scam', {
        history: historyPayload,
        persona: persona
      });

      const baitReply: ChatMessage = {
        sender: 'bait',
        text: res.data.suggested_reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...updatedMessages, baitReply]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyLatestBait = () => {
    const latestBait = [...messages].reverse().find(m => m.sender === 'bait');
    if (latestBait) {
      navigator.clipboard.writeText(latestBait.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        sender: 'scammer',
        text: 'Pay Rs 5000 immediately or your account will be permanently blocked within 10 minutes.',
        time: 'Just now'
      }
    ]);
  };

  // Harvest suspect indicators from conversation
  const harvestIndicators = () => {
    const combined = messages.filter(m => m.sender === 'scammer').map(m => m.text).join(' ');
    const phones = combined.match(/(?:\+91|0)?[6-9]\d{9}/g) || [];
    const upis = combined.match(/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g) || [];
    const amounts = combined.match(/(?:rs\.?|inr|₹)\s*\d+(?:,\d+)*(?:\.\d+)?/gi) || [];

    return {
      phones: Array.from(new Set(phones)),
      upis: Array.from(new Set(upis)),
      amounts: Array.from(new Set(amounts))
    };
  };

  const harvested = harvestIndicators();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '2rem', background: '#000000', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid #a855f7', borderRadius: '12px' }}>
              <Bot size={28} style={{ color: '#a855f7' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                Autonomous AI Counter-Scam Baitalyzer
              </h2>
              <p style={{ color: '#d4d4d8', margin: 0, fontSize: '0.95rem' }}>
                Reverse-engineer scammer operations by wasting their human bandwidth and safely extracting suspect financial intelligence.
              </p>
            </div>
          </div>

          {/* Live Bandwidth Wasted HUD */}
          <div style={{
            background: '#000000',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            padding: '0.6rem 1rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Clock size={20} style={{ color: '#a855f7' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Scammer Time Wasted
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: '#a855f7' }}>
                {formatTimer(elapsedSeconds)}
              </div>
            </div>
          </div>
        </div>

        {/* Persona Selector */}
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {PERSONAS.map(p => {
            const isSelected = persona === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setPersona(p.id)}
                style={{
                  background: isSelected ? 'rgba(168, 85, 247, 0.08)' : '#000000',
                  border: `1px solid ${isSelected ? '#a855f7' : 'rgba(255, 255, 255, 0.15)'}`,
                  padding: '1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>{p.name}</span>
                  {isSelected && <span style={{ fontSize: '0.7rem', color: '#a855f7', border: '1px solid #a855f7', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Active Persona</span>}
                </div>
                <p style={{ color: '#d4d4d8', fontSize: '0.8rem', margin: 0 }}>{p.tagline}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Chat & Harvesting Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Chat Thread */}
        <div className="glass-card" style={{ padding: '1.75rem', background: '#000000', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column', height: '620px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={18} style={{ color: '#a855f7' }} />
              Live Baiting Dialogue
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={copyLatestBait}
                style={{
                  background: '#000000',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
              >
                {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Bait'}</span>
              </button>
              <button 
                onClick={handleReset}
                style={{
                  background: '#000000',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#a1a1aa',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                title="Reset conversation"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
            {messages.map((m, idx) => {
              const isScammer = m.sender === 'scammer';
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isScammer ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isScammer ? 'flex-start' : 'flex-end'
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: isScammer ? '#ef4444' : '#a855f7', marginBottom: '0.2rem', fontWeight: 600 }}>
                    {isScammer ? '🛑 Scammer Message' : '🛡️ AI Honeypot Bait Response'}
                  </span>
                  <div
                    style={{
                      padding: '0.85rem 1.1rem',
                      borderRadius: '16px',
                      background: isScammer ? 'rgba(239, 68, 68, 0.1)' : 'rgba(168, 85, 247, 0.15)',
                      border: `1px solid ${isScammer ? 'rgba(239, 68, 68, 0.3)' : 'rgba(168, 85, 247, 0.4)'}`,
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      lineHeight: 1.5
                    }}
                  >
                    {m.text}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#71717a', marginTop: '0.2rem' }}>
                    {m.time}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '14px', color: '#a855f7', fontSize: '0.85rem' }}>
                <Sparkles className="animate-spin" size={16} />
                Synthesizing high-delay bait reply...
              </div>
            )}
          </div>

          {/* Input form */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Paste next scammer response here..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputText.trim()}
              className="btn btn-primary"
              style={{ background: '#a855f7', color: '#ffffff', padding: '0.75rem 1.25rem' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Intelligence Harvester & Strategy Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Quick Scenario Injectors */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#000000', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontWeight: 600 }}>
              Inject Common Scammer Openers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {SCAM_STARTERS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.text)}
                  style={{
                    background: '#000000',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#a855f7';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{s.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                      {s.text}
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: '#a855f7', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Harvested Intelligence Vault */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#000000', border: '1px solid rgba(255, 255, 255, 0.2)', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FileText size={18} style={{ color: '#10b981' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                Suspect Intelligence Harvester
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#a1a1aa', fontSize: '0.75rem', textTransform: 'uppercase' }}>Extracted Phone Numbers</span>
                <div style={{ marginTop: '0.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {harvested.phones.length > 0 ? (
                    harvested.phones.map((p, i) => (
                      <span key={i} style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: '0.2rem 0.5rem', borderRadius: '6px', fontFamily: 'monospace', color: '#38bdf8' }}>
                        {p}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#71717a', fontStyle: 'italic', fontSize: '0.8rem' }}>Awaiting phone number probe...</span>
                  )}
                </div>
              </div>

              <div>
                <span style={{ color: '#a1a1aa', fontSize: '0.75rem', textTransform: 'uppercase' }}>Extracted Payment VPAs / Accounts</span>
                <div style={{ marginTop: '0.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {harvested.upis.length > 0 ? (
                    harvested.upis.map((u, i) => (
                      <span key={i} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '0.2rem 0.5rem', borderRadius: '6px', fontFamily: 'monospace', color: '#ef4444' }}>
                        {u}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#71717a', fontStyle: 'italic', fontSize: '0.8rem' }}>Baitalyzer currently requesting payee VPA...</span>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                  <UserCheck size={14} />
                  <span>National Cyber Crime Coordination Centre (I4C) Ready</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#d4d4d8' }}>
                  All extracted bank handles and mobile identifiers are cross-referenced with the Chakshu & Sanchar Saathi telecom blacklists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock } from 'lucide-react';

export default function Auth({ onLogin }: { onLogin: () => void }) {
  const providers = [
    { name: 'Google', color: '#DB4437' },
    { name: 'Microsoft', color: '#00A4EF' },
    { name: 'NVIDIA', color: '#76B900' },
    { name: 'Amazon', color: '#FF9900' },
    { name: 'Apple', color: '#A2AAAD' },
    { name: 'ByteDance', color: '#00F2FE' },
    { name: 'OpenAI', color: '#10A37F' },
    { name: 'Anthropic', color: '#D2B48C' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000000', color: '#ffffff' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', marginBottom: '1.25rem' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Enterprise SSO</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Authenticate with your corporate provider.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {providers.map(p => (
            <button 
              key={p.name}
              onClick={onLogin}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.85rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = p.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <Lock size={16} color={p.color} />
              Continue with {p.name}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
            By authenticating, you agree to the organizational terms of service and privacy policies of your identity provider.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

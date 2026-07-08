import { useState, useEffect } from 'react';
import { Plus, Shield, Lock, Eye, EyeOff, Copy, ExternalLink, Check, MoreVertical, Edit, Trash2, Loader2, AlertTriangle, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CredentialModal from '../components/CredentialModal';
import { decryptAES } from '../lib/crypto';

export default function Vault() {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [revealedId, setRevealedId] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [pinPromptFor, setPinPromptFor] = useState<number | null>(null);
  const [pin, setPin] = useState('');
  const [credentials, setCredentials] = useState<any[]>([]);
  const [decryptedPasswords, setDecryptedPasswords] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orbit_vault')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching vault credentials:', error);
    } else {
      setCredentials(data || []);
    }
    setIsLoading(false);
  };

  const handleCopy = (id: number, type: 'password' | 'username') => {
    const cred = credentials.find(c => c.id === id);
    if (cred) {
      // If password, it must be decrypted first
      const textToCopy = type === 'password' ? (decryptedPasswords[id] || 'ENCRYPTED') : cred.username;
      
      if (textToCopy === 'ENCRYPTED') {
        alert("Please unlock the password first before copying.");
        return;
      }
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      });
    }
  };

  const toggleReveal = (id: number) => {
    if (revealedId === id) {
      setRevealedId(null);
    } else {
      setPinPromptFor(id);
      setPin('');
    }
  };

  const submitPin = () => {
    const cred = credentials.find(c => c.id === pinPromptFor);
    if (cred && pin.length >= 4) {
      const decrypted = decryptAES(cred.encrypted_password, pin);
      
      if (decrypted) {
        setDecryptedPasswords(prev => ({ ...prev, [cred.id]: decrypted }));
        setRevealedId(pinPromptFor);
        setPinPromptFor(null);
      } else {
        alert("Decryption failed. Incorrect Master PIN.");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Security Vault</h1>
          <p className="text-secondary">AES-256 Client-side Encrypted Credentials.</p>
        </div>
        <div className="flex-center" style={{ gap: '12px' }}>
          <button className="btn btn-secondary">
            <Users size={18} />
            Share Vault
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            New Credential
          </button>
        </div>
      </div>

      <div className="glass-panel delay-1 mb-4" style={{ backgroundColor: 'var(--primary-transparent)', border: '1px solid var(--border-gold)' }}>
        <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
            <Shield size={24} className="text-gold" />
          </div>
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '4px' }}>Zero-Knowledge Architecture</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              Your master key never leaves this device. We cannot read your passwords, even if requested.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '64px 24px', textAlign: 'center' }}>
          <Loader2 size={32} className="text-primary animate-spin" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <p className="text-secondary">Decrypting vault contents...</p>
        </div>
      ) : credentials.length > 0 ? (
        <div className="grid-cards delay-2">
          {credentials.map((cred) => (
            <div key={cred.id} className="glass-panel" style={{ padding: '20px' }}>
              <div className="flex-between mb-3 dropdown-container">
                <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-base)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
                    <Lock size={18} className="text-secondary" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{cred.service}</h3>
                    <a href={`https://${cred.url}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {cred.url} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
                <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === cred.id ? null : cred.id); }}>
                  <MoreVertical size={18} />
                </button>
                {activeDropdown === cred.id && (
                  <div className="dropdown-menu" onClick={(e) => e.stopPropagation()} style={{ right: 0, top: '40px' }}>
                    <button className="dropdown-item">
                      <Edit size={14} /> Edit
                    </button>
                    <button className="dropdown-item danger">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
              
              <div style={{ backgroundColor: 'var(--bg-base)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ marginBottom: '16px' }}>
                  <span className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Username / Email</span>
                  <div className="flex-between mt-1">
                    <span style={{ fontSize: '0.95rem', fontFamily: 'monospace' }}>{cred.username}</span>
                    <button className="btn-icon" style={{ padding: '4px' }} onClick={() => handleCopy(cred.id, 'username')}>
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="flex-between">
                    <span className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Password</span>
                    {/* Mock Compromised Password UI Badge for the pitch */}
                    {cred.id === credentials[0]?.id && (
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', backgroundColor: 'rgba(255, 69, 58, 0.1)', color: 'var(--danger)', borderRadius: '12px', border: '1px solid rgba(255, 69, 58, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={10} /> Payment Risk Detected
                      </span>
                    )}
                  </div>
                  <div className="flex-between mt-1">
                    <span style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: revealedId === cred.id ? 'var(--text-primary)' : 'var(--text-tertiary)', letterSpacing: revealedId === cred.id ? 'normal' : '2px' }}>
                      {revealedId === cred.id ? decryptedPasswords[cred.id] : '••••••••••••••••'}
                    </span>
                    <div className="flex-center" style={{ gap: '8px' }}>
                      <button className="btn-icon" style={{ padding: '4px' }} onClick={() => toggleReveal(cred.id)}>
                        {revealedId === cred.id ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button className="btn-icon" style={{ padding: '4px' }} onClick={() => handleCopy(cred.id, 'password')}>
                        {copiedId === cred.id ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
                {pinPromptFor === cred.id && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-gold)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '8px' }}>Master PIN required for decryption</p>
                    <div className="flex-between" style={{ gap: '8px' }}>
                      <input 
                        type="password" 
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="••••"
                        style={{ flex: 1, padding: '8px 12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && submitPin()}
                      />
                      <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={submitPin}>Verify</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel delay-2" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--bg-base)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid var(--border-subtle)' }}>
            <Lock size={32} className="text-tertiary" />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Vault is Empty</h3>
          <p className="text-secondary" style={{ marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>Your zero-knowledge vault is ready. Add your first credential to secure it with client-side AES-256 encryption.</p>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            New Credential
          </button>
        </div>
      )}
      
      <CredentialModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchCredentials} 
      />
    </div>
  );
}



import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { encryptAES } from '../lib/crypto';

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CredentialModal({ isOpen, onClose, onSuccess }: CredentialModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    service: '',
    url: '',
    username: '',
    password: '',
    pin: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pin.length < 4) {
      alert("Master PIN must be at least 4 characters.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const userId = user?.id || '00000000-0000-0000-0000-000000000000';
      
      // Perform AES-256 Client-Side Encryption
      const encryptedPassword = encryptAES(formData.password, formData.pin);

      const { error } = await supabase
        .from('orbit_vault')
        .insert([{
          user_id: userId,
          service: formData.service,
          url: formData.url,
          username: formData.username,
          encrypted_password: encryptedPassword
        }]);

      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error adding credential:', err);
      alert('Failed to add credential. Check RLS policies or database connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', padding: '16px'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '0', overflow: 'hidden' }}>
        <div className="flex-between" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ margin: 0 }}>Add Secure Credential</h3>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Service Name</label>
                <input 
                  type="text" required placeholder="e.g. AWS Console" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Website URL</label>
                <input 
                  type="text" placeholder="e.g. aws.amazon.com" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Username / Email</label>
                <input 
                  type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Password</label>
                <input 
                  type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              
              <div style={{ marginTop: '8px', padding: '16px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px' }}>Master PIN (Encryption Key)</label>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}>This PIN is used to encrypt your password client-side using AES-256. If you forget it, the password cannot be recovered.</p>
                <input 
                  type="password" required placeholder="••••" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Encrypting & Saving...' : <><Check size={16} /> Encrypt & Save</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

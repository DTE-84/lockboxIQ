import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PREDEFINED_SERVICES = [
  // Lifestyle & Gear
  { name: 'Bespoke Post', category: 'Lifestyle & Gear', logo_emoji: '🏕️', defaultCost: 49.00, cancel_url: 'https://www.bespokepost.com/account/settings' },
  { name: 'FabFitFun', category: 'Lifestyle & Gear', logo_emoji: '✨', defaultCost: 59.99, cancel_url: 'https://fabfitfun.com/my-account/' },
  { name: 'Breo Box', category: 'Lifestyle & Gear', logo_emoji: '🔌', defaultCost: 159.00, cancel_url: 'https://www.breobox.com/account' },
  // Clothing & Styling
  { name: 'Stitch Fix', category: 'Clothing', logo_emoji: '👕', defaultCost: 20.00, cancel_url: 'https://www.stitchfix.com/my-account/settings' },
  { name: 'Rent the Runway', category: 'Clothing', logo_emoji: '👗', defaultCost: 94.00, cancel_url: 'https://www.renttherunway.com/account/membership' },
  // Food & Gourmet
  { name: 'HelloFresh', category: 'Food & Drink', logo_emoji: '🥦', defaultCost: 69.00, cancel_url: 'https://www.hellofresh.com/settings/plan' },
  { name: 'Goldbelly', category: 'Food & Drink', logo_emoji: '🍕', defaultCost: 79.00, cancel_url: 'https://www.goldbelly.com/account' },
  { name: 'Trade Coffee', category: 'Food & Drink', logo_emoji: '☕', defaultCost: 19.50, cancel_url: 'https://www.drinktrade.com/account/subscriptions' },
  // Self-Care, Beauty & Books
  { name: 'IPSY', category: 'Self-Care & Beauty', logo_emoji: '💄', defaultCost: 14.00, cancel_url: 'https://www.ipsy.com/account/membership' },
  { name: 'TheraBox', category: 'Self-Care & Beauty', logo_emoji: '🧘', defaultCost: 39.99, cancel_url: 'https://mytherabox.com/account' },
  { name: 'Book of the Month', category: 'Books', logo_emoji: '📚', defaultCost: 17.99, cancel_url: 'https://www.bookofthemonth.com/account' },
  // Entertainment & Utilities (Originals)
  { name: 'Netflix', category: 'Entertainment', logo_emoji: '🍿', defaultCost: 22.99, cancel_url: 'https://www.netflix.com/YourAccount' },
  { name: 'Max (HBO)', category: 'Entertainment', logo_emoji: '🟣', defaultCost: 15.99, cancel_url: 'https://auth.max.com/account' },
  { name: 'Peacock', category: 'Entertainment', logo_emoji: '🦚', defaultCost: 5.99, cancel_url: 'https://www.peacocktv.com/account' },
  { name: 'Spotify', category: 'Music', logo_emoji: '🎧', defaultCost: 10.99, cancel_url: 'https://www.spotify.com/us/account/overview/' },
  { name: 'Apple Music', category: 'Music', logo_emoji: '🎵', defaultCost: 10.99, cancel_url: 'https://music.apple.com/account' },
  { name: 'Custom', category: 'Other', logo_emoji: '📦', defaultCost: 0.00, cancel_url: '' },
];

export default function SubscriptionModal({ isOpen, onClose, onSuccess }: SubscriptionModalProps) {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cost: '',
    billing_cycle: 'Monthly',
    payment_method: '',
    logo_emoji: '📦',
    cancel_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectService = (service: any) => {
    setSelectedService(service);
    setFormData({
      name: service.name === 'Custom' ? '' : service.name,
      category: service.category,
      cost: service.defaultCost > 0 ? service.defaultCost.toString() : '',
      billing_cycle: 'Monthly',
      payment_method: '',
      logo_emoji: service.logo_emoji,
      cancel_url: service.cancel_url || ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In standalone Orbit, auth might not be fully linked yet, so fallback user_id for dev
      const userId = user?.id || '00000000-0000-0000-0000-000000000000';

      const { error } = await supabase
        .from('orbit_subscriptions')
        .insert([{
          user_id: userId,
          name: formData.name,
          category: formData.category,
          cost: parseFloat(formData.cost) || 0,
          billing_cycle: formData.billing_cycle,
          status: 'Active',
          payment_method: formData.payment_method || 'Credit Card',
          logo_emoji: formData.logo_emoji,
          cancel_url: formData.cancel_url || ''
        }]);

      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error adding subscription:', err);
      alert('Failed to add subscription. Ensure your RLS policies allow inserts (you must be logged in if RLS is strict).');
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
          <h3 style={{ margin: 0 }}>Add Subscription</h3>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
          {!selectedService ? (
            <>
              <p className="text-secondary mb-3">Select a popular provider to quick-fill details, or choose Custom.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                {PREDEFINED_SERVICES.map((srv) => (
                  <button
                    key={srv.name}
                    onClick={() => handleSelectService(srv)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      padding: '16px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                      borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  >
                    <span style={{ fontSize: '2rem' }}>{srv.logo_emoji}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}>{srv.name}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex-between mb-4">
                <div className="flex-center" style={{ gap: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{formData.logo_emoji}</span>
                  <h3 style={{ margin: 0 }}>{selectedService.name === 'Custom' ? 'Custom Subscription' : selectedService.name}</h3>
                </div>
                <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setSelectedService(null)}>
                  Change
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedService.name === 'Custom' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Service Name</label>
                    <input 
                      type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                )}
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Cost</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>$</span>
                    <input 
                      type="number" step="0.01" required value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px 10px 28px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Billing Cycle</label>
                    <select 
                      value={formData.billing_cycle} onChange={e => setFormData({...formData, billing_cycle: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Annually">Annually</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Category</label>
                    <input 
                      type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Payment Method (Optional)</label>
                    <input 
                      type="text" placeholder="e.g. Visa ending in 4242" value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Cancellation URL (Optional)</label>
                    <input 
                      type="url" placeholder="https://" value={formData.cancel_url} onChange={e => setFormData({...formData, cancel_url: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : <><Check size={16} /> Save Subscription</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

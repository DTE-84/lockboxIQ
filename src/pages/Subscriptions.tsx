import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, MoreVertical, CreditCard, Edit, PauseCircle, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SubscriptionModal from '../components/SubscriptionModal';

export default function Subscriptions() {
  const [search, setSearch] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orbit_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching subscriptions:', error);
    } else {
      setSubscriptions(data || []);
    }
    setIsLoading(false);
  };

  const filteredSubs = subscriptions.filter(sub => sub.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Active Subscriptions</h1>
          <p className="text-secondary">Manage your recurring billing and service providers.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} />
          Add Subscription
        </button>
      </div>

      <div className="glass-panel delay-1" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                backgroundColor: 'var(--bg-base)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <button className="btn btn-secondary">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Loader2 size={32} className="text-primary animate-spin" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <p className="text-secondary">Loading subscriptions...</p>
          </div>
        ) : filteredSubs.length > 0 ? (
          <div className="responsive-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem', width: '35%' }}>Service Provider</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Cost</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Payment Method</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Status</th>
                  <th style={{ padding: '16px 24px', width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredSubs.map((sub, i) => (
                  <tr key={sub.id} style={{ borderBottom: i !== filteredSubs.length - 1 ? '1px solid var(--border-subtle)' : 'none', transition: 'background-color 0.2s', backgroundColor: 'transparent' }} className="hover-row">
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex-center" style={{ gap: '16px', justifyContent: 'flex-start' }}>
                        <div style={{ fontSize: '1.2rem', width: '36px', height: '36px', backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                          {sub.logo_emoji || '📦'}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontWeight: 600 }}>{sub.name}</h4>
                          <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{sub.category}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <h4 style={{ margin: 0 }}>${sub.cost ? Number(sub.cost).toFixed(2) : '0.00'}</h4>
                      <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{sub.billing_cycle}</span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
                        <CreditCard size={16} className="text-tertiary" />
                        <span style={{ fontSize: '0.9rem' }}>{sub.payment_method || 'N/A'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge ${sub.status === 'Active' ? 'badge-success' : ''}`} style={{ 
                        ...(sub.status !== 'Active' ? { backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' } : {})
                      }}>
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center', position: 'relative' }} className="dropdown-container">
                      <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === sub.id ? null : sub.id); }}>
                        <MoreVertical size={18} />
                      </button>
                      {activeDropdown === sub.id && (
                        <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                          <button className="dropdown-item">
                            <Edit size={14} /> Edit
                          </button>
                          <button className="dropdown-item">
                            <PauseCircle size={14} /> Pause
                          </button>
                          {sub.cancel_url && (
                            <button className="dropdown-item" onClick={() => window.open(sub.cancel_url, '_blank')}>
                              <ExternalLink size={14} /> Cancel Service
                            </button>
                          )}
                          <button className="dropdown-item danger">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--bg-base)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid var(--border-subtle)' }}>
              <CreditCard size={32} className="text-tertiary" />
            </div>
            <h3 style={{ marginBottom: '8px' }}>No Subscriptions Found</h3>
            <p className="text-secondary" style={{ marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>You aren't tracking any subscriptions yet. Add your first service to start monitoring your recurring spend.</p>
            <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} />
              Add Subscription
            </button>
          </div>
        )}
        <style>{`
          .hover-row:hover { background-color: var(--bg-surface-hover) !important; cursor: pointer; }
        `}</style>
      </div>
      
      <SubscriptionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchSubscriptions} 
      />
    </div>
  );
}

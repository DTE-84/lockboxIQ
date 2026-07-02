import { Shield, Code, Server, Network } from 'lucide-react';

export default function Breakdown() {
  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Architectural Breakdown</h1>
          <p className="text-secondary">High-Fidelity Case Study & Integration Details.</p>
        </div>
      </div>

      <div className="glass-panel delay-1 mb-4">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--primary)' }}>LockboxIQ / SubscriptionIQ</h2>
        <p style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', marginBottom: '24px' }}>
          LockboxIQ serves as a dedicated, standalone top-of-funnel entry point into the DTE ecosystem. While it operates as its own product for credential and subscription tracking, it is fundamentally engineered as a <strong>Bundle Add-On for Pulse</strong>. 
          By unifying the auth layer and postgres instance via Supabase, users receive this high-fidelity Vault as a bundled perk, anchoring the $14.99/mo value of Pulse while expanding the ecosystem's feature depth.
        </p>
        
        <div className="grid-cards mt-2">
          <div style={{ backgroundColor: 'var(--bg-base)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div className="flex-center mb-3" style={{ justifyContent: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: 'var(--primary-transparent)', borderRadius: '8px' }}>
                <Shield size={20} className="text-gold" />
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Zero-Knowledge Architecture</h3>
            </div>
            <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              The password vault sits in its own isolated schema. Utilizing client-side AES-256 encryption, the master key never touches the server. This establishes the absolute trust foundation required for a high-fidelity credential manager.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-base)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div className="flex-center mb-3" style={{ justifyContent: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: 'var(--primary-transparent)', borderRadius: '8px' }}>
                <Server size={20} className="text-gold" />
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Shared Postgres Nexus</h3>
            </div>
            <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              Operating on the same Supabase architecture as Pulse. Single auth layer across both apps — one login, one account, two products. Shared component libraries ensure UI consistency and drastically reduce build time.
            </p>
          </div>
          
          <div style={{ backgroundColor: 'var(--bg-base)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div className="flex-center mb-3" style={{ justifyContent: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: 'var(--primary-transparent)', borderRadius: '8px' }}>
                <Network size={20} className="text-gold" />
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Plaid Integration</h3>
            </div>
            <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              Since Plaid is already wired up in Pulse, subscription auto-detection from bank transactions becomes the killer feature of LockboxIQ. Infrastructure is extended, not rebuilt.
            </p>
          </div>
        </div>
      </div>
      
      <div className="glass-panel delay-2">
        <div className="flex-between mb-4">
          <h2 style={{ fontSize: '1.2rem' }}>DTE Ecosystem Unity</h2>
          <Code size={20} className="text-secondary" />
        </div>
        <ul className="list-container" style={{ padding: 0, margin: 0, listStyle: 'none' }}>
          <li className="list-item">
            <div>
              <h4 style={{ margin: '0 0 4px 0' }}>Pulse</h4>
              <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Core Behavioral Finance Pipeline</span>
            </div>
            <span className="badge badge-success">Active Core</span>
          </li>
          <li className="list-item">
            <div>
              <h4 style={{ margin: '0 0 4px 0' }}>LockboxIQ</h4>
              <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Subscription & Credential Vault (Bundle Add-On)</span>
            </div>
            <span className="badge badge-success">Active Core</span>
          </li>
          <li className="list-item">
            <div>
              <h4 style={{ margin: '0 0 4px 0' }}>PCSP & Quarterly</h4>
              <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Strategic Planning Modules</span>
            </div>
            <span className="badge badge-success">Active Core</span>
          </li>
          <li className="list-item">
            <div>
              <h4 style={{ margin: '0 0 4px 0' }}>SparkIQ & ResaleIQ</h4>
              <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Commerce & Market Intelligence</span>
            </div>
            <span className="badge badge-success">Active Core</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

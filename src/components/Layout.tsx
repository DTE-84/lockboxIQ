import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, CreditCard, LogOut, Settings, BookOpen } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} /> , label: 'Dashboard' },
    { path: '/subscriptions', icon: <CreditCard size={20} /> , label: 'Subscriptions' },
    { path: '/vault', icon: <Shield size={20} /> , label: 'Lockbox Vault' },
    { path: '/breakdown', icon: <BookOpen size={20} /> , label: 'Architecture' },
  ];

  return (
    <div className="sidebar">
      <div className="flex-center mb-4" style={{ justifyContent: 'flex-start', padding: '0 8px' }}>
        <Shield size={28} className="text-gold" style={{ marginRight: '12px' }} />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Lockbox</h2>
      </div>
      
      <nav className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      
      <div style={{ marginTop: 'auto' }}>
        <div className="nav-item" style={{ cursor: 'pointer' }}>
          <Settings size={20} />
          Settings
        </div>
        <div className="nav-item mt-1" style={{ cursor: 'pointer', color: 'var(--danger)' }}>
          <LogOut size={20} />
          Sign Out
        </div>
      </div>
    </div>
  );
};

export default function Layout() {
  return (
    <div className="app-container animate-fade-in">
      <Sidebar />
      <main className="main-content">
        <header className="header">
          <div>
            {/* Contextual header title could go here */}
          </div>
          <div className="flex-center" style={{ gap: '16px' }}>
            <span className="text-secondary" style={{ fontSize: '0.9rem' }}>drew@dte.solutions</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-gold)', color: 'var(--primary)', fontWeight: 'bold' }}>
              D
            </div>
          </div>
        </header>
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

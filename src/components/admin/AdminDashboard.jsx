import { useAuth } from '../../context/AuthContext'
import { useMobile } from '../../hooks/useMobile'

export default function AdminDashboard({ children, activeTab, onTabChange, participants }) {
  const { user, signOut } = useAuth()
  const isMobile = useMobile()

  const completed = (participants || []).filter(p => p.completed).length
  const total = (participants || []).length

  const tabs = [
    { id: 'data', label: 'Participantes' },
    { id: 'charts', label: 'Estadísticas' },
  ]

  return (
    <div style={s.layout}>
      <header style={s.header}>
        {/* Row 1: logo + right actions */}
        <div style={s.row1}>
          <div style={s.logoWrap}>
            <span style={s.logo}>🧠 CogniFace</span>
            <span style={s.badge}>Admin</span>
          </div>
          <div style={s.rightActions}>
            {!isMobile && (
              <span style={s.userEmail}>{user?.email}</span>
            )}
            <button style={s.signOut} onClick={signOut}>Salir</button>
          </div>
        </div>

        {/* Row 2 (always): tabs + email on mobile */}
        <div style={s.row2}>
          <nav style={s.nav}>
            {tabs.map(t => (
              <button
                key={t.id}
                style={{ ...s.tab, ...(activeTab === t.id ? s.tabActive : {}) }}
                onClick={() => onTabChange(t.id)}
              >
                {t.label}
                {t.id === 'data' && total > 0 && (
                  <span style={{
                    ...s.count,
                    background: activeTab === t.id ? 'rgba(108,99,255,0.25)' : 'rgba(42,63,90,0.8)',
                  }}>
                    {completed}/{total}
                  </span>
                )}
              </button>
            ))}
          </nav>
          {isMobile && user?.email && (
            <span style={s.mobileEmail}>{user.email.split('@')[0]}</span>
          )}
        </div>
      </header>

      <main style={{ ...s.main, padding: isMobile ? '16px 12px' : '28px 32px' }}>
        {children}
      </main>
    </div>
  )
}

const s = {
  layout: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' },
  header: {
    background: 'rgba(26,45,66,0.98)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #2A3F5A',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '0 16px',
  },
  row1: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    gap: 12,
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  logo: { fontSize: 16, fontWeight: 700, color: 'var(--color-text)' },
  badge: {
    background: 'linear-gradient(135deg, #6C63FF, #A78BFA)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 10,
    letterSpacing: '0.06em',
  },
  rightActions: { display: 'flex', alignItems: 'center', gap: 10 },
  userEmail: { fontSize: 12, color: 'var(--color-text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  mobileEmail: { fontSize: 11, color: 'var(--color-text-muted)', flexShrink: 0 },
  signOut: {
    background: 'none',
    border: '1px solid #2A3F5A',
    color: 'var(--color-text-muted)',
    padding: '4px 10px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    whiteSpace: 'nowrap',
  },
  row2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    gap: 8,
    borderTop: '1px solid rgba(42,63,90,0.4)',
  },
  nav: { display: 'flex', gap: 4 },
  tab: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    padding: '6px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    whiteSpace: 'nowrap',
  },
  tabActive: { background: 'rgba(108,99,255,0.15)', color: 'var(--color-text)' },
  count: { fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 10, color: 'var(--color-text-muted)' },
  main: { flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%' },
}

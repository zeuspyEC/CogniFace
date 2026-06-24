import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard({ children, activeTab, onTabChange, participants }) {
  const { user, signOut } = useAuth()
  const tabs = [
    { id: 'data', label: 'Participantes' },
    { id: 'charts', label: 'Estadísticas' },
  ]

  const completed = (participants || []).filter(p => p.completed).length
  const total = (participants || []).length

  return (
    <div style={s.layout}>
      <header style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.logo}>🧠 CogniFace</span>
          <span style={s.badge}>Admin</span>
        </div>

        <nav style={s.nav}>
          {tabs.map(t => (
            <button key={t.id}
              style={{ ...s.tab, ...(activeTab === t.id ? s.tabActive : {}) }}
              onClick={() => onTabChange(t.id)}>
              {t.label}
              {t.id === 'data' && total > 0 && (
                <span style={{ ...s.count, background: activeTab === t.id ? 'rgba(108,99,255,0.25)' : 'rgba(42,63,90,0.8)' }}>
                  {completed}/{total}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={s.headerRight}>
          <span style={s.userEmail}>{user?.email}</span>
          <button style={s.signOut} onClick={signOut}>Salir</button>
        </div>
      </header>

      <main style={s.main}>{children}</main>
    </div>
  )
}

const s = {
  layout: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' },
  header: {
    background: 'rgba(26,45,66,0.95)',
    backdropFilter: 'blur(12px)',
    padding: '0 28px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    borderBottom: '1px solid #2A3F5A',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  logo: { fontSize: 17, fontWeight: 700, color: 'var(--color-text)' },
  badge: {
    background: 'linear-gradient(135deg, #6C63FF, #A78BFA)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 10,
    letterSpacing: '0.06em',
  },
  nav: { display: 'flex', gap: 4, flex: 1 },
  tab: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    padding: '6px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.15s',
  },
  tabActive: { background: 'rgba(108,99,255,0.15)', color: 'var(--color-text)', borderColor: 'rgba(108,99,255,0.3)' },
  count: { fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 10, color: 'var(--color-text-muted)' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  userEmail: { fontSize: 12, color: 'var(--color-text-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  signOut: {
    background: 'none',
    border: '1px solid #2A3F5A',
    color: 'var(--color-text-muted)',
    padding: '5px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    transition: 'all 0.15s',
  },
  main: { flex: 1, padding: '28px 32px', maxWidth: 1200, margin: '0 auto', width: '100%' },
}
